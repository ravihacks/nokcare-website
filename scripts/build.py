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
    rendered = re.sub(r'\{\{(\w+)\}\}', lambda match: str(values[match[1]]), text)
    return '\n'.join(line.rstrip() for line in rendered.splitlines())

def service_cards(items, on_services=False):
    rows = []
    for number, item in enumerate(items, 1):
        target = 'contact.html' if on_services else 'services.html#' + item['id']
        label = 'Ask about this service' if on_services else 'Read about this service'
        title = escape(item.get('displayTitle', item['title']))
        rows.append(f'<article class="service-card" id="{escape(item["id"])}"><span class="number" aria-hidden="true">{number:02d}</span><a class="service-card-link" href="{target}" aria-label="{label}: {title}"><div class="service-copy"><h3>{title}</h3><p>{escape(item["description"])}</p></div><span class="service-card-action"><span class="service-link-label">{label}</span><span class="service-arrow" aria-hidden="true">↗</span></span></a></article>')

    return '<div class="service-grid">' + ''.join(rows) + '</div>'

values = {key: escape(str(site[key])) for key in ['name', 'email', 'address']}
values.update(phone=escape(site['phones'][0]), second_phone=escape(site['phones'][1]), phone_link=site['phones'][0].replace(' ', ''), second_phone_link=site['phones'][1].replace(' ', ''), year=date.today().year)
values['areas'] = '<div class="pills">' + ''.join('<span class="pill">' + escape(area) + '</span>' for area in site['areas']) + '</div>'
service_lookup = {item['id']: item for item in services}
groups = json.loads((ROOT / 'content/service-groups.json').read_text())
values['all_services'] = ''.join(
    '<section class="service-group"><div class="service-group-intro"><h2>' + escape(group['title']) + '</h2><p>' + escape(group['description']) + '</p><img class="service-group-photo" src="assets/images/' + escape(group['image']) + '" alt="' + escape(group['alt']) + '" width="' + str(group['width']) + '" height="' + str(group['height']) + '" loading="lazy"></div>' + service_cards([service_lookup[key] for key in group['services']], True) + '</section>'
    for group in groups)
form_settings = json.loads((ROOT / 'content/forms.json').read_text())
if form_settings['mode'] != 'preview' or form_settings['endpoint'] is not None or form_settings['participantDataEnabled']:
    raise ValueError('Live forms and participant collection require a reviewed secure integration.')
for form_type in ['contact', 'referral']:
    config = form_settings[form_type]
    form_id = form_type + '-enquiry'
    form_values = { 'form_id': form_id, 'form_title': escape(config['title']), 'form_intro': escape(config['intro']), 'form_notice': escape(config['notice']), 'form_status': escape(config['status']), 'form_button': escape(config['button']), 'form_topic_label': 'What would you like to discuss?' if form_type == 'contact' else 'Your relationship to the enquiry', 'form_options': ''.join('<option>' + escape(option) + '</option>' for option in config['options']), 'form_message': '' }
    if form_type == 'contact':
        form_values['form_message'] = '<div class="full"><label for="' + form_id + '-message">Your message <span class="required-label">(required)</span></label><p class="field-help" id="' + form_id + '-message-help">General questions only. Do not include health details, NDIS numbers or participant records.</p><textarea id="' + form_id + '-message" name="message" required maxlength="2000" aria-describedby="' + form_id + '-message-help"></textarea></div>'
    values[form_type + '_form'] = render((ROOT / 'components/enquiry-form.html').read_text(), form_values)
values['featured_services'] = service_cards([services[index] for index in [6, 0, 7]])
values['values'] = ''.join('<div class="value"><h3>' + escape(item['title']) + '</h3><p>' + escape(item['description']) + '</p></div>' for item in json.loads((ROOT/'content/values.json').read_text()))
styles = ''.join(f'<link rel="stylesheet" href="css/{name}.css">' for name in ['brand','global','components','layout','responsive'])
for page in pages:
    key = page['file'].removesuffix('.html')
    navigation = ''.join(f'<a href="{item["file"]}"' + (' aria-current="page"' if item['file'] == page['file'] else '') + f'>{escape(item["nav"])}</a>' for item in pages if item['file'] != 'referral.html')
    current = dict(values, navigation=navigation)
    hero_copy = '<div class="page-heading-copy"><span class="eyebrow">' + escape(page['eyebrow']) + '</span><h1>' + escape(page['heading']) + '</h1><p class="lead">' + escape(page['intro']) + '</p></div>'
    hero_image = ''
    if page.get('heroImage'):
        photo = page['heroImage']
        hero_image = '<img class="page-heading-image" src="' + escape(photo['src']) + '" alt="' + escape(photo['alt']) + '" width="' + str(photo['width']) + '" height="' + str(photo['height']) + '" fetchpriority="high">'
    current['page_hero'] = '<section class="page-hero"><div class="container"><div class="breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>' + escape(page['nav']) + '</span></div><div class="page-heading page-heading--image">' + hero_copy + hero_image + '</div></div></section>'

    header = render((ROOT/'components/header.html').read_text(),current)
    # The referral CTA also indicates the active page.
    if key == 'referral':
        header = header.replace('class="button button-small" href="referral.html"','class="button button-small" href="referral.html" aria-current="page"')
    footer = render((ROOT/'components/footer.html').read_text(),current)
    body = render((ROOT/f'templates/{key}.html').read_text(),current)
    document = f'''<!doctype html>
<html lang="en-AU"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{escape(page['title'])}</title><meta name="description" content="{escape(page['description'])}"><meta name="theme-color" content="#F8F5EF"><meta property="og:title" content="{escape(page['title'])}"><meta property="og:description" content="{escape(page['description'])}"><meta property="og:type" content="website"><link rel="icon" href="assets/icons/favicon.svg" type="image/svg+xml">{styles}<script type="module" src="js/main.js"></script></head><body class="page-{key}">{header}<main id="main" tabindex="-1">{body}</main>{footer}</body></html>'''
    (ROOT/page['file']).write_text(document + '\n')
    print('Built', page['file'])
