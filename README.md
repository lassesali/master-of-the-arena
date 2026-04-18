This project is licensed under the MIT License - see the LICENSE file for details. 
Copyright (c) 2014 Lasse Sali.

# Master of the Arena (2014)

Master of the Arena is a client-server prototype for a web-browser game, originally developed and optimized for the browser ecosystem of 2014 (specifically Firefox and Chrome). 

This project serves as a time capsule of early HTML5 web game development, demonstrating a custom-built data communication flow and game loop without relying on modern frameworks. It showcases foundational skills in full-stack architecture, utilizing raw AJAX and XML to bridge the gap between a graphical frontend and a database-driven backend.

## 🧠 Under the Hood: The Custom Game Engine

Rather than relying on pre-built frameworks, the core of this prototype is a bespoke, data-driven GUI engine and game loop built entirely from scratch. It was designed to separate logic, state, and presentation into a highly modular architecture.

### Key Architectural Features:

* **Finite State Machine (FSM):**
  The application flow is strictly controlled by a custom FSM. State transitions (like moving from `USER_LOGIN` to `MANAGERS_OFFICE`) trigger a custom rendering loop that clears the DOM and sequentially rebuilds the UI layers required for the new state (`redrawScreenState()`).

* **Context-Aware UI Routing:**
  Before modern routers existed, this engine utilized an XML manifest (`GUIFiles.xml`) to act as a custom router. It features conditional logic to dynamically serve completely different UI layouts based on the environment (e.g., seamlessly swapping between a standard login screen and a Facebook Canvas-optimized screen at runtime).

* **Declarative, Data-Driven Layouts (XML over HTML):**
  Instead of hardcoding the DOM, the application structure is defined declaratively in XML configuration files. The core engine (`game.js`) fetches these files via AJAX (powered by jQuery), parses the tags, and dynamically generates the HTML elements (`document.createElement`) and input fields on the fly.

* **XML-Driven Event Handling:**
  Standard JavaScript event listeners were bypassed in favor of a custom, configuration-based event system. Raw mouse interactions are captured and passed to a central behavior manager (`GuiBehavior.js`). This manager reads logic rules from `GuiBehaviour.xml` to dynamically trigger JavaScript functions based on element IDs, classes, and the current FSM state.

* **Dynamic Localization & Legacy Responsive Scaling & Vector Text Scaling:**
  A custom localization engine parses language files (`English.xml`, `Finnish.xml`) and injects the correct strings into the UI at runtime. Because this was built before Flexbox or CSS Grid were viable, the UI relies on highly precise, percentage-based CSS positioning calculated against parent aspect ratios. To ensure the localized text scaled perfectly across resolutions, the engine parses `<vector>` coordinates from the XML and utilizes `Raphaël.js` to draw transformable SVG vector text over the DOM elements.

* **Raw Full-Stack Auth & Session Management:**
  The frontend state is tightly coupled with a PHP/MySQL backend. The engine handles complex handshake logic to manage sessions, integrating directly with legacy Facebook SDK and Google OpenID (`LightOpenID`) OAuth flows. Raw PHP endpoints query the database and return user data via JSON to dynamically inject profile pictures and names into the DOM upon successful authentication.
  
## 🛠️ Tech Stack (Circa 2014)

**Client-Side (Frontend):**
* HTML5
* Vanilla JavaScript 
* XML
* Raphaël 2.1.0 (JavaScript Vector Library)
* jQuery v1.9.1 (DOM Manipulation & AJAX)
* FastClick (Optimized touch responsiveness)

**Server-Side (Backend):**
* PHP
* MySQL

## 🛠️ Feature Prototypes (2014)

**🕹️ Play the live prototypes here:** [https://lassesali.github.io/master-of-the-arena/](https://lassesali.github.io/master-of-the-arena/)

This repository also includes a collection of standalone HTML/JS prototypes developed in 2014. These were built as targeted technical testbeds to explore and experiment with core mechanics for **Master of the Arena**. 

Ultimately, these specific prototypes **were never integrated into the main project**. Instead, they remain here as an archive of the game's early Research & Development phase. They serve as a time capsule of the project's technical evolution—most notably documenting the transition from standard HTML5 2D Canvas rendering (using `Pixastic.js`) to hardware-accelerated WebGL rendering (using `Pixi.js`).

### What These Prototypes Explored:

* **The Combat Engine (`arena.html`):** A 2D simulation prototype for the game's core "gladiator" combat/racing loop. It was built to test custom playback controls, time-stepping, and the live text-commentary feed.
* **Character Customization (`cartoon.html` & `cartoonpixi08.html`):** Early builds of the character creator. These tested the UI and layering systems needed to let players customize a gladiator's race, hair, facial symmetry, and eye color.
* **Asset Coloring (`blendmodes.html` & `blendmodes_pixi.js.html`):** Technical tests to figure out how to dynamically colorize those character assets. They tested various hardware and software-based blend modes (like Multiply, Screen, and Lighten) to seamlessly merge textures and color hexes.
* **The Overworld (`pixihexagon12.html`):** The foundation for a planned exploration and navigation system. It tested the complex math required for a staggered hex-grid, biome generation via XML data, minimap camera panning, and path-drafting.
* **Time & Performance (`fps_timeline.html`):** A crucial technical testbed used to figure out how to decouple the underlying game logic (simulation speed) from the visual rendering loop (FPS). This was to ensure arena simulations would run consistently regardless of a player's browser performance.
