#!/usr/bin/env python3
"""Assemble dependency-free HTML pages. Run from any working directory."""
import json
import re
from datetime import date
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
site = json.loads((ROOT / 'content/site.json').read_text())
services = json.loads((ROOT / 'content/services.json').read_text())
pages = json.loads((ROOT / 'content/pages.json').read_text())

def render(text, values):
    return re.sub(r'\{\{(\w+)\}\}', lambda match: str(values[match[1]]), text)

def service_cards(items, on_services=False):
    cards = []
    for number, item in enumerate(items, 1):
        target = 'contact.html' if on_services else 'services.html#' + item['id']
        label = 'Discuss this service' if on_services else 'Explore service'
        image = '<div class="service-image"><img src="assets/images/' + escape(item['image']) + '" alt="" width="1000" height="667" loading="lazy"></div>'
        cards.append(f'<article class="service-card" id="{escape(item["id"])}">{image}<span class="number" aria-hidden="true">{number:02d} / SUPPORT</span><h3>{escape(item["title"])}</h3><p>{escape(item["description"])}</p><a href="{target}" aria-label="{label}: {escape(item["title"])}">{label} <span aria-hidden="true">↗</span></a></article>')
    return '<div class="service-grid">' + ''.join(cards) + '</div>'

values = {key: escape(str(site[key])) for key in ['name', 'email', 'address']}
values.update(phone=escape(site['phones'][0]), second_phone=escape(site['phones'][1]), phone_link=site['phones'][0].replace(' ', ''), second_phone_link=site['phones'][1].replace(' ', ''), year=date.today().year)
values['hero_inset'] = '<img class="hero-inset" src="' + escape(site['images']['heroInset']['src']) + '" alt="' + escape(site['images']['heroInset']['alt']) + '" width="1000" height="667">'
values['areas'] = '<div class="pills">' + ''.join('<span class="pill">' + escape(area) + '</span>' for area in site['areas']) + '</div>'
values['all_services'] = service_cards(services, True)
values['featured_services'] = service_cards([services[index] for index in [6, 0, 7]])
values['values'] = ''.join('<div class="value"><h3>' + escape(item['title']) + '</h3><p>' + escape(item['description']) + '</p></div>' for item in json.loads((ROOT/'content/values.json').read_text()))
styles = ''.join(f'<link rel="stylesheet" href="css/{name}.css">' for name in ['brand','global','components','layout','responsive'])
for page in pages:
    key = page['file'].removesuffix('.html')
    navigation = ''.join(f'<a href="{item["file"]}"' + (' aria-current="page"' if item['file'] == page['file'] else '') + f'>{escape(item["nav"])}</a>' for item in pages if item['file'] != 'referral.html')
    current = dict(values, navigation=navigation)
    current['page_hero'] = '<section class="page-hero"><div class="container page-hero-grid"><div class="page-hero-copy"><div class="breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>' + escape(page['nav']) + '</span></div><span class="eyebrow">' + escape(page['eyebrow']) + '</span><h1>' + escape(page['heading']) + '</h1><p class="lead">' + escape(page['intro']) + '</p></div><div class="page-hero-image"><img src="assets/images/' + escape(page['image']) + '" alt="" width="1100" height="751" fetchpriority="high"><span class="photo-label">Choice. Connection. Care.</span></div></div></section>'
    header = render((ROOT/'components/header.html').read_text(),current)
    # The referral CTA also indicates the active page.
    if key == 'referral':
        header = header.replace('class="button button-small" href="referral.html"','class="button button-small" href="referral.html" aria-current="page"')
    footer = render((ROOT/'components/footer.html').read_text(),current)
    body = render((ROOT/f'templates/{key}.html').read_text(),current)
    document = f'''<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{escape(page['title'])}</title><meta name="description" content="{escape(page['description'])}"><meta name="theme-color" content="#F8F5EF"><meta property="og:title" content="{escape(page['title'])}"><meta property="og:description" content="{escape(page['description'])}"><meta property="og:type" content="website"><link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">{styles}<script type="module" src="js/main.js"></script></head><body>{header}<main id="main" tabindex="-1">{body}</main>{footer}</body></html>'''
    (ROOT/page['file']).write_text(document + '\n')
    print('Built', page['file'])
