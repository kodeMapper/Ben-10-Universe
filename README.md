# Ben 10 Universe

A fan-made website about the world of **Ben 10**, built as one of my early web-development learning projects during my first year of engineering.

Ben 10 has always been one of my favourite cartoons. I chose this topic because it gave me a fun way to practice creating a complete multi-page website while exploring the Omnitrix, alien transformations, villains, and the story behind the series.

## About the project

This website is built with the fundamentals of front-end development only:

- HTML for the page structure
- CSS for the visual design, animations, and responsive layouts
- Vanilla JavaScript for navigation sounds, Omnitrix controls, and carousels

No front-end libraries, frameworks, or build tools are used.

## Features

- Omnitrix-style navigation with rotation and sound effects
- Home-page carousel with smooth automatic sliding, numbered controls, keyboard navigation, and touch swipe support
- Dedicated pages for the Omnitrix, its evolution, alien transformations, and villains
- Responsive layout for mobile, tablet, and desktop screens
- Videos, images, animations, and themed visual styling
- Contact and about pages

## Pages

| Page | Description |
| --- | --- |
| Home | Introduction to the Ben 10 Universe and the main carousel |
| How Ben Got the Omnitrix | The beginning of Ben's journey with the Omnitrix |
| Working of the Omnitrix | Information about the device and its powers |
| Alien Transformations | A carousel of Ben's alien forms |
| Evolution of the Omnitrix | Different Omnitrix versions across the series |
| Villains | Notable antagonists from the Ben 10 Universe |
| About | Background of the creator and the project |
| Contact | Social links and a contact form |

## Project structure

```text
.
├── CSS/       # Main, responsive, and shared styles
├── HTML/      # Content pages
├── images/    # Website images and artwork
├── JS/        # Vanilla JavaScript interactions
├── Sounds/    # Omnitrix click and transformation sounds
├── Videos/    # Video content
└── index.html # Website entry point
```

## Run locally

You can open `index.html` directly in a browser. For the most reliable local experience, serve the folder with a simple local web server:

```bash
python -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173) in your browser.

## What I learned

Building this project helped me practice:

- Structuring multi-page websites
- Linking pages and assets correctly
- CSS layout, responsive design, media queries, and animations
- DOM manipulation and event handling with JavaScript
- Building a carousel without external libraries
- Debugging navigation and mobile-layout issues

## Disclaimer

This is an unofficial fan project made for learning and personal portfolio purposes. Ben 10 and related characters, names, images, and trademarks belong to their respective owners.

---

Made with nostalgia for the Ben 10 Universe and enthusiasm for learning web development.
