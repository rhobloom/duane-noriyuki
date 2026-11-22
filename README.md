# Duane Noriyuki — archive site v0.1

This is the first static prototype for the Duane Noriyuki archive.

## What is here

- A quiet editorial/archival visual system.
- Theme-driven archive browsing rather than chronology alone.
- Three initial "threads": **what we leave behind**, **the garden**, and **second look**.
- A seed archive of verified/strongly sourced work discovered during research.
- A first-class photography section ready for Duane's photographs.
- A simple data model in `assets/data.js` so the archive can grow without redesigning the site.

## Important

The article metadata includes a `status` field:

- `confirmed` — we have a reliable source confirming the work.
- `lead` — useful research lead that still needs stronger verification.

Blank `url` values are intentional. We should not invent links for pieces that we have only confirmed through secondary bibliographic sources.

No third-party article text or copyrighted photographs are reproduced here.

## Edit the homepage slideshow

Open a photo in the gallery to see its ID below the enlarged image. In [the slideshow list](https://github.com/rhobloom/duane-noriyuki/edit/main/assets/home-slides.txt), put one photo ID per line, in the order you want it shown. Commit the edit with a GitHub account that can write to this repository. GitHub Pages publishes the change. An empty list hides the slideshow.

The four gallery categories and image descriptions are in `assets/photography-data.js`. Personal projects and links to new essays belong in `personal-work.html`.
