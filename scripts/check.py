"""Dependency-free release checks; run browser QA separately."""
import json
import re
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent

class Page(HTMLParser):
    def __init__(self, text):
        super().__init__()
        self.ids, self.links, self.images, self.labels, self.fields = [], [], [], [], []
        self.headings, self.metadata, self.titles = [], {}, []
        self.main, self.header, self.footer = 0, 0, 0
        self.title_open = False
        self.language = None
        self.feed(text)

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if re.fullmatch(r'h[1-6]', tag):
            self.headings.append(int(tag[1]))
        if tag == 'html':
            self.language = attrs.get('lang')
        if tag == 'main': self.main += 1
        if tag == 'header': self.header += 1
        if tag == 'footer': self.footer += 1
        if tag == 'title': self.title_open = True
        if tag == 'meta':
            self.metadata[attrs.get('name', attrs.get('property'))] = attrs.get('content')
        if tag == 'img': self.images.append(attrs)
        if tag == 'label': self.labels.append(attrs.get('for'))
        if tag in ('input', 'select', 'textarea'): self.fields.append(attrs.get('id'))
        for attr in ('href', 'src'):
            if attr in attrs: self.links.append(attrs[attr])

    def handle_endtag(self, tag):
        if tag == 'title': self.title_open = False

    def handle_data(self, data):
        if self.title_open: self.titles.append(data)

pages = {p.name: Page(p.read_text()) for p in ROOT.glob('*.html')}
assert len(pages) == 5
for name, page in pages.items():
    assert page.headings.count(1) == page.main == page.header == page.footer == 1, name
    assert all(current <= previous + 1 for previous, current in zip(page.headings, page.headings[1:])), (name, 'heading hierarchy')
    assert page.language == 'en-AU', name
    assert len(page.titles) == 1 and page.titles[0].strip(), name
    assert page.metadata.get('description') and page.metadata.get('viewport'), name
    assert page.metadata.get('og:title') and page.metadata.get('og:description'), name
    assert len(page.ids) == len(set(page.ids)), name
    assert all('alt' in image and int(image.get('width', 0)) > 0 and int(image.get('height', 0)) > 0 for image in page.images), name
    assert all(field in page.labels for field in page.fields), name
    assert '{{' not in (ROOT / name).read_text(), name
    for link in page.links:
        url = urlsplit(link)
        if url.scheme or url.netloc: continue
        target = unquote(url.path or name)
        assert (ROOT / target).exists(), (name, link)
        if url.fragment and target in pages:
            assert unquote(url.fragment) in pages[target].ids, (name, link)
assert len({page.titles[0] for page in pages.values()}) == 5, 'Duplicate titles'
assert len({page.metadata['description'] for page in pages.values()}) == 5, 'Duplicate descriptions'
for stylesheet in (ROOT / 'css').glob('*.css'):
    for url in re.findall(r'url\([\'"]?([^\)\'\"]+)', stylesheet.read_text()):
        assert not urlsplit(url).scheme and (stylesheet.parent / url).is_file(), (stylesheet, url)
for script in (ROOT / 'js').glob('*.js'):
    assert not any(term in script.read_text() for term in ['localStorage', 'sessionStorage', 'fetch(']), script
assert json.loads((ROOT / 'content/site.json').read_text())['contactFormEndpoint'] is None
print('PASS: five pages; metadata and heading hierarchy; semantic landmarks; local links/fragments; image metadata; field labels; CSS assets; no unresolved placeholders, browser storage or form-network code.')
