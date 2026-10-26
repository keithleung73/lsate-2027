# LSATE 2027 — GLL (Hong Kong, China) 2027 ‘Let Students Talk about Education’ International Conference 網站（v2.1：已填入真實資料）

Static site — **no build step**. Just open `index.html` in a browser.
(The Google Map and YouTube embeds work best when served over http(s). To test locally:
`python3 -m http.server 8000` in this folder, then visit http://localhost:8000.)

The older formal draft is kept untouched at `/workspace/lsate-conference-2027/` as a backup.

## Files

```
index.html              All page structure + ALL CHINESE TEXT (default language)
css/style.css           All styling (colours/fonts are variables at the top, in :root)
js/i18n.js              ALL ENGLISH TEXT (one entry per data-i18n key)
js/main.js              Language toggle, mobile menu, countdown, scroll animations,
                        YouTube click-to-play, photo lightbox, FAQ
images/highlights/      9 past-event photos (2021 LSATE, 2023 GLL) — extracted from the school's reports
images/logos/           Organiser + supporting-organiser logos (from the 2027 proposal .docx)
screenshots/            Preview screenshots (desktop / mobile, 中文 + English)
```

Sections (in order, with their `id` for links): Hero + countdown · marquee · `#about` LSATE × GLL (three tracks) ·
`#theme` 2027 主題 / background / objectives · `#days` 14 & 15 May · `#programme` 15 May rundown ·
`#join` rules, judging rubric, fees · `#register` 報名 · `#speakers` 講者 · `#past` 往屆 timeline + photos + video ·
`#partners` 主辦 / 支持機構 · `#venue` 場地 · `#faq` 常見問題 · `#contact` 聯絡 · footer.

## Where the content comes from (v2.1)

All facts come from three files sent by the school — nothing else was added:

* **2027 proposal (.docx)** — theme, background, objectives, the two dates, format, eligibility and rules,
  language, judging rubric (Appendix 2), fees, the full 15 May rundown, organiser + 15 supporting organisers
  (logos), contact phone / email / fax / website, registration deadline 22 Feb 2027.
* **2021 conference reflections (.pdf)** — 23 Jan 2021 online conference, 500+ participants, regions,
  15 primary + 12 secondary teams, Prof. Kenneth Leung / Prof. Erwin Huang, 3 photos.
* **GLL (Hong Kong) 2023 Series 1 report (.pdf)** — 18 Feb 2023, theme “The Global Wealth Gap”,
  Prof. Chiu Chi Yue, Oxfam primary workshops, 6 photos.

* **GLL (Hong Kong) 2022 Series 1 Post-Conference Report (.pdf)** — 25 Jun 2022, 10:00–12:00, online;
  theme “The Next Global Threat: Climate Change and the Future of Work”; keynote Dr. Lam Chiu Ying;
  welcome Prof. Tam Man Kwan; sharing Principal Wong Wing Tung; 5 gallery photos.
  (PDF text was outlined — facts recovered via OCR of rendered pages + the cover date “JUN 25th”.)

* **GLL (Hong Kong) 2024 Series 1 Post-Conference Report** — 11 May 2024 at MKPC; theme Artificial Intelligence…; keynote Prof. Wong Kam Fai; judges Professor Law, Ms. Pang, Professor Lee, Dr. Mack; 4 gallery photos from page renders.
* **‘Let Students Talk About Education’ International Conference 2025 booklet** — 10 May 2025, 8:45–12:30 GMT+8; theme Intangible Cultural Heritage: Preservation and Transmission; keynote Prof. Mak King-sang, MH; rundown facts. **Programme booklet only — no 2025 on-the-day photos** (past-highlight pages show earlier years).

~~**Still pending:** 2024 and 2025 booklets (~424–432 MB) exceed the 100 MB CopyToBox limit; extraction on the
user’s PC is still pending — no 2024/2025 content on the site yet.

**Translations:** the official theme is in English only. The Chinese version on the page
(`theme.zh`, `<p class="theme-zh">` in `index.html`, plus the shorter hero teaser `hero.themeText`) is a
**DRAFT TRANSLATION written for this website — please have it checked** before publishing.
The Chinese conference name 「讓學生談教育」 is also our translation of ‘Let Students Talk about Education’
(no Chinese name appears in the sources). Prof. Tam and Principal Wong are shown with their English names in both
languages because the proposal gives no Chinese names.

“6th edition / 第六屆” was **removed** — no source supports it (the sources only show 2021, 2023 and a 2026 form).

## Editing text (both languages)

Every piece of text has a key, e.g.

```html
<h3 data-i18n="why.1t">大膽發聲</h3>
```

* **Chinese**: edit the text directly in `index.html` (here: `大膽發聲`).
* **English**: open `js/i18n.js`, find the same key and edit it:
  `"why.1t": "Speak up",`
* Text may contain simple HTML such as `<strong>`, `<br>`, or the TBA badge
  `<b class="tba">待公布</b>` / `<b class="tba">TBA</b>`.
* Attributes (placeholder, aria-label, map title…) use `data-i18n-attr="placeholder:reg.namePh"`;
  the Chinese value is the attribute in `index.html`, the English value is the key in `i18n.js`.
* Adding new text: give the element a new `data-i18n="my.key"` and add `"my.key": "English…"` to `i18n.js`.
  If an English entry is missing, the Chinese text stays and a warning appears in the browser console.

The 中 / EN button in the header switches every text; the choice is remembered in the browser
(`localStorage` key `lsate-lang`). Default is Chinese.

Some English strings deliberately keep a little Chinese as a bilingual accent (e.g. the hero shows
「讓學生談教育」 under the English title, the Chinese subtitles of the two day cards, the school's Chinese name).
Entries that are an empty string `""` in `i18n.js` (e.g. `theme.zh`, the Chinese line of each rundown item)
are hidden in English mode on purpose.

## Replacing placeholders (TBA)

Search `index.html` and `js/i18n.js` for `tba`, `待公布`, `TBA`, `示意`, `EXAMPLE`, `SAMPLE`.
When an item is confirmed, replace the badge with the real text in **both** files.
Remove the dark “網站初稿 / Website draft” bar at the very top (`<div class="draft-bar">`) when the site goes live.

Still TBA on the site (not in any source): the **2027 online registration link**, the **conference contact person**,
the **keynote professor's name**, **video links**, the **14 May schedule** and **poster competition rules**,
transport directions / room on campus, and a downloadable enrolment form (Appendix 3 of the proposal).

* **Programme**: the 15 May rundown is real (`<ol class="timeline rundown">`, keys `prog.1`…`prog.9`;
  `t-hot` = highlighted item, `t-break` = recess, `t-end` = end). The 14 May line `prog.d1` shows TBA.
* **Speakers**: in each `<li class="spk-card">`, replace `<div class="spk-avatar">?</div>` content with
  `<img src="images/speakers/name.jpg" alt="Name">` and change the name / role / affiliation text
  (give each card its own keys, e.g. `spk.n1`).
* **Registration**: there is no sample form any more. Step 1 (online form) shows a disabled button because the
  Google Form link in the proposal (forms.gle/JLb1NAd1aZmqwea59, QR → forms.gle/Wgb6YLkxMEDs9qSt7) still opens the
  **2026** form. When the 2027 form is ready, follow the HTML comment in `#register`: replace
  `<span class="btn btn-block btn-disabled" …>` with
  `<a class="btn btn-yellow btn-block" href="https://forms.gle/…" target="_blank" rel="noopener" data-i18n="reg.m1btn">…</a>`
  and remove the `<b class="tba">` badge next to `reg.m1d`. Step 2 (email / fax) is real: enquiries@mkpc.edu.hk, fax (852) 2447 1924.

## Swapping videos (YouTube)

In the `#past` section the promo video box looks like:

```html
<div class="yt" data-youtube-id="" ...>
```

Put the video ID between the quotes. The ID is the part after `v=` in
`https://www.youtube.com/watch?v=AbCdEfGhIjK` (or after `youtu.be/`) → `data-youtube-id="AbCdEfGhIjK"`.
The page then shows the video thumbnail with a play button; the player (youtube-nocookie.com) only loads when clicked,
so the page stays fast. Leave it empty to keep the colourful placeholder. Make sure the video is Public or Unlisted
and embedding is allowed. Update the captions (`media.c1`, `media.c2`…) in both languages.

## Swapping photos

The photos in `images/highlights/` were extracted from the 2021 reflections PDF (`2021-*.jpg`), the GLL 2022
Series 1 booklet (`2022-*.jpg`) and the 2023 GLL report PDF (`2023-*.jpg`), resized to max 1200 px
(the 2022/2023 ones were lightly colour-corrected).
They show students, so please confirm the school is happy to publish them on a public website.

1. Copy photos into `images/highlights/` (landscape 4:3 works best; ~1200–1600 px wide, under ~400 KB each).
2. In `index.html`, set `data-photo` on a tile and (optionally) a description for screen readers:

```html
<figure class="photo p1" data-photo="images/highlights/photo-01.jpg" data-alt="Students presenting on stage">
```

3. Edit its caption (`media.p1` in `index.html` = Chinese, in `js/i18n.js` = English).

Tiles with an empty `data-photo` keep the striped placeholder. Real photos open in a lightbox (Esc or × to close).
The first tile is shown large on desktop. Add/remove `<li>` tiles freely. Please make sure the school has consent to publish photos of students.

## Logos

`images/logos/` — trimmed from the proposal .docx: `mkpc` (organiser), `gll` (event series) and 14 supporting
organisers (`ifuture` was converted from an EMF file). The 15th supporting organiser, Chinese Writing Wizard, is shown
as a text tile because its logo could not be identified with certainty (the unlabelled panda logo in the docx was not used).

## Countdown

Counts to **15 May 2027 8:30 am Hong Kong time** — registration opens at 8:30 according to the rundown
(`js/main.js`, `Date.parse('2027-05-15T08:30:00+08:00')`). Change it there if needed and update the note `cd.note`.

## Design notes

* Palette (variables in `css/style.css`): electric violet `#6A2CF5`, hot pink `#FF4D8D`, sunny yellow `#FFD43B`,
  mint `#2EE6B6`, sky `#5CCBFF`, orange `#FF8A3D`, ink `#1B1036` on cream `#FFF7EA`.
* Fonts (Google Fonts): **Unbounded** (bold display / numbers), **Noto Sans TC** (Chinese), **DM Sans** (English body).
* Style: “sticker” look — thick ink outlines, offset shadows, speech bubbles, gradient hero with drifting blobs,
  marquee ticker, scroll-reveal and hover wiggles. All animation is switched off for users with
  “reduce motion” turned on, and all content is visible without JavaScript.
* Mobile-first, hamburger menu under 960 px, no frameworks (≈ 90 KB of HTML/CSS/JS before compression).

## Screenshots

Regenerate with the tool in `/workspace/shot-tool/`:

```
cd /workspace/lsate-2027-v2 && python3 -m http.server 8766 &
cd /workspace/shot-tool && node shot-v2.js          # hero-desktop, desktop-full, programme-desktop, gallery-desktop, mobile-full
node shot-v2.js --extra                             # + English versions, mobile hero and mobile menu
```

Functional checks (missing English keys, images/logos loading, countdown, lightbox, reduced motion, no-JS):
`cd /workspace/shot-tool && node check-v2.js` (server on :8766).
