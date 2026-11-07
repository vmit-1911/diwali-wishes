# DEEPAVALI — A WORLD OF LIGHTS
## Interactive Storytelling & Diwali Experience for Your Best Friend

An award-winning, mobile-first cinematic web application built with React 19, TypeScript, Vite, Tailwind CSS v4, Framer Motion, HTML5 Canvas Particle Systems, and an integrated Web Audio synthesizer.

---

### ✨ Features & Story Chapters

1. **Chapter 0: The Unknown World (Opening)**
   - Progressive, ethereal narrative line reveal.
   - Central mystical star with touch-and-hold energy charging mechanics.
   - Dynamic orbiting particle rings that culminate in a radiant light explosion.

2. **Chapter 1: Create Your Magic (Rangoli Drawing)**
   - Touch & drag interactive powder drawing canvas with 8-fold radial symmetry.
   - Authentic Diwali Rangoli palette (Gold, Festive Pink, Cyan, Saffron, Purple, Green).
   - Audio feedback with sparkle chimes upon powder strokes.

3. **Chapter 2: Light Up The Diyas**
   - 7 realistic clay diyas arranged along the traditional Indian courtyard floor.
   - Individual touch interaction: spark ignites wick, realistic multi-frequency flickering flame, oil puddle reflection, and rising warm light.
   - Global illumination expands with each diya lit.

4. **Chapter 3: The World Comes Alive**
   - Hanging traditional Indian Kandil lanterns swinging with realistic pendulum physics.
   - Touch to illuminate lanterns, trigger bursts of sparkles, and bring festive fairy light strings to life.

5. **Chapter 4: A Little Surprise (Royal Envelope & Letter)**
   - 3D perspective golden envelope with a royal wax seal.
   - Unfolds to reveal a personalized letter addressed to your best friend with ornate filigree borders and warm gold typography.

6. **Chapter 5: The Final Spark (Anar Firecracker)**
   - Traditional Indian flowerpot firecracker (Anar).
   - Touch and hold the fuse to watch the spark travel down the rope with crackling sound and smoke simulation before erupting into a golden fountain.

7. **Chapter 6: Grand Finale & Reveal**
   - Dynamic HTML5 Canvas fireworks physics engine.
   - Tap anywhere on screen to launch rockets with realistic trails, sparks, gravity, and deep booming explosions.
   - Glowing gold typography with heartfelt personalized wishes and editable sender signature.
   - Interactive **Replay Magic** and **Celebrate Again** actions.

8. **Sound Design (Web Audio Synthesizer)**
   - Procedural, zero-dependency audio synthesis: Tanpura/temple drone, gentle Raag Yaman windchimes, flame whooshes, fuse crackles, and explosive fireworks.
   - Mute / Unmute control toggle on top-right.

---

### 🛠️ Customization

Edit [`src/config/diwaliConfig.ts`](file:///c:/Users/mitran/Downloads/Diwali-Wishes-website/src/config/diwaliConfig.ts) to customize:
- `friendName`: Your friend's name (e.g. `"Sneha"`, `"Rahul"`).
- `senderName`: Your name.
- `letter`: Salutation, custom paragraphs, and closing note.
- `finalGreeting`: Hero title, dedication, and customized wishes.
- `rangoliColors` & `fireworkColors`: Color palettes.
- `diyaCount`: Number of courtyard diyas.

---

### 🚀 Running & Deploying

#### Development
```bash
npm run dev
```

#### Production Build
```bash
npm run build
```

The output in `dist/` is ready to deploy directly to Vercel, Netlify, or GitHub Pages.
