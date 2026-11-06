"""Static release checks. Browser QA is still required."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit, unquote
import json
ROOT=Path(__file__).resolve().parent.parent
class Page(HTMLParser):
    def __init__(self, text):
        super().__init__();self.ids=[];self.links=[];self.h1=0;self.main=0;self.images=[];self.labels=[];self.fields=[];self.feed(text)
    def handle_starttag(self, tag, attributes):
        a=dict(attributes)
        if 'id' in a:self.ids.append(a['id'])
        if tag=='h1':self.h1+=1
        if tag=='main':self.main+=1
        if tag=='img':self.images.append(a)
        if tag=='label':self.labels.append(a.get('for'))
        if tag in ('input','select','textarea'):self.fields.append(a.get('id'))
        for attr in ('href','src'):
            if attr in a:self.links.append(a[attr])
pages={p.name:Page(p.read_text()) for p in ROOT.glob('*.html')}
assert len(pages)==5
for name, page in pages.items():
    assert page.h1==page.main==1,name
    assert len(page.ids)==len(set(page.ids)),name
    assert all('alt' in i and 'width' in i and 'height' in i for i in page.images),name
    assert all(i in page.labels for i in page.fields),name
    assert '{{' not in (ROOT/name).read_text(),name
    for link in page.links:
        url=urlsplit(link)
        if url.scheme or url.netloc:continue
        target=url.path or name
        assert (ROOT/unquote(target)).exists(),(name,link)
        if url.fragment and target in pages:assert url.fragment in pages[target].ids,(name,link)
for p in ROOT.glob('js/*.js'):
    assert not any(term in p.read_text() for term in ['localStorage','sessionStorage','fetch(']),p
assert json.loads((ROOT/'content/site.json').read_text())['contactFormEndpoint'] is None
print('PASS: five pages, single H1/main, unique IDs, resolved links/fragments, image metadata, labelled fields, no unresolved placeholders or storage/network form code.')
