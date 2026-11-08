"""Dependency-free checks for portfolio structure and search metadata."""
import json
from html.parser import HTMLParser
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
BASE = "https://hmohammadifar.github.io/hmohammadifar/"
PAGES = ("index.html", "about.html", "research.html", "publications.html", "cv.html", "contact.html")


class Page(HTMLParser):
    def __init__(self, filename):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.ids = []
        self.data_scripts = []
        self.in_json = False
        self.json_text = ""
        self.feed((ROOT / filename).read_text(encoding="utf-8"))

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.tags.append((tag, attrs))
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.in_json = True
            self.json_text = ""

    def handle_data(self, data):
        if self.in_json:
            self.json_text += data

    def handle_endtag(self, tag):
        if tag == "script" and self.in_json:
            self.data_scripts.append(json.loads(self.json_text))
            self.in_json = False

    def find(self, tag, **attrs):
        return [item for name, item in self.tags if name == tag and all(item.get(k) == v for k, v in attrs.items())]


class SiteTests(unittest.TestCase):
    def test_structure_and_local_links(self):
        for filename in (*PAGES, "404.html"):
            with self.subTest(page=filename):
                page = Page(filename)
                self.assertEqual(len(page.find("h1")), 1)
                self.assertEqual(len(page.find("main", id="main", tabindex="-1")), 1)
                self.assertTrue(page.find("a", href="#main"))
                self.assertTrue(page.find("nav", **{"aria-label": "Primary"}))
                self.assertEqual(len(page.ids), len(set(page.ids)))
                for tag, attrs in page.tags:
                    value = attrs.get("href") if tag in ("a", "link") else attrs.get("src") if tag in ("script", "img") else None
                    if value and not value.startswith(("#", "https:", "http:", "mailto:", "tel:")):
                        self.assertTrue((ROOT / value.split("#")[0].split("?")[0]).is_file(), value)
                for attrs in page.find("div", **{"class": "table-wrap"}):
                    self.assertEqual(attrs.get("tabindex"), "0")
                    self.assertTrue(attrs.get("aria-label"))

    def test_canonical_and_social_urls(self):
        for filename in PAGES:
            with self.subTest(page=filename):
                page = Page(filename)
                url = BASE if filename == "index.html" else BASE + filename
                self.assertEqual(len(page.find("link", rel="canonical", href=url)), 1)
                self.assertEqual(len(page.find("meta", property="og:url", content=url)), 1)
                self.assertTrue(page.find("meta", name="description"))
        self.assertTrue(Page("404.html").find("meta", name="robots", content="noindex"))

    def test_sitemap_and_structured_data(self):
        root = ET.parse(ROOT / "sitemap.xml").getroot()
        urls = {el.text for el in root.findall("{http://www.sitemaps.org/schemas/sitemap/0.9}url/{http://www.sitemaps.org/schemas/sitemap/0.9}loc")}
        self.assertEqual(urls, {BASE if name == "index.html" else BASE + name for name in PAGES})
        self.assertEqual(Page("index.html").data_scripts[0]["@type"], "Person")
        article = Page("publications.html").data_scripts[0]
        self.assertEqual(article["@type"], "ScholarlyArticle")
        self.assertEqual(article["datePublished"], "2026-09-30")
        self.assertEqual(len(article["author"]), 4)

    def test_only_one_publication_and_contact(self):
        page = Page("publications.html")
        self.assertEqual(len(page.find("li", **{"data-pub-type": "journal"})), 1)
        self.assertEqual(len([a for tag, a in page.tags if tag == "li" and "data-pub-type" in a]), 1)
        self.assertTrue(page.find("a", href="https://jad.shahroodut.ac.ir/article_3978.html"))
        contact = Page("contact.html")
        self.assertTrue(contact.find("a", href="mailto:Mohammadifar27@Gmail.com"))
        self.assertTrue(contact.find("a", href="tel:+989189524171"))
        self.assertTrue(contact.find("p", role="status"))


if __name__ == "__main__":
    unittest.main()
