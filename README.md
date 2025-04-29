# Physics Simulations Collection

An interactive collection of 3D physics simulations built using Next.js, Three.js, and React. This educational toolkit allows users to explore various physics phenomena through interactive visualizations.

## 🔍 Available Simulations

### Capillary Tube Simulation

Explore how different liquids behave in a glass capillary tube. Adjust the liquid type and fill level to see changes in meniscus formation and capillary action.

### Pendulum Motion Simulation

Visualize the motion of simple pendulums. Adjust parameters like length, mass, initial angle, and gravity to see how they affect the pendulum's behavior.

## 🚀 Live Demo

<!-- Update with your actual deployment URL when available -->
<!-- Visit the [live demo](https://your-deployment-url.vercel.app) to try the simulations without installation. -->

## 🛠️ Technologies Used

- **Next.js 15**: React framework with app router for frontend
- **React 19**: UI component library
- **Three.js**: 3D graphics library for web browsers
- **React Three Fiber**: React renderer for Three.js
- **Drei**: Useful helpers for React Three Fiber
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework

## 📋 Prerequisites

- Node.js 18.17.0 or later
- Yarn or npm package manager

## ⚙️ Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/capillary-tube-project.git
   cd capillary-tube-project
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the simulations.

## 🏗️ Project Structure

```
src/
├── app/                      # Next.js app router
│   ├── page.tsx              # Homepage
│   ├── layout.tsx            # Root layout
│   └── simulations/          # Simulation routes
│       ├── capillary-tube/   # Capillary tube simulation
│       └── pendulum/         # Pendulum simulation
├── components/               # React components
│   ├── CapillaryTube/        # Components for capillary tube simulation
│   ├── Pendulum/             # Components for pendulum simulation
│   ├── Controls/             # Shared control components
│   └── UI/                   # Shared UI components like Navigation
└── types/                    # TypeScript type definitions
```

## 🧪 Adding New Simulations

To add a new simulation:

1. Create a new directory in `src/app/simulations/` for your simulation
2. Add the required components in `src/components/`
3. Define types in `src/types/` as needed
4. Add the simulation to the navigation in `src/components/UI/Navigation.tsx`
5. Add the simulation card on the homepage in `src/app/page.tsx`

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-simulation`)
3. Commit your changes (`git commit -m 'Add new wave simulation'`)
4. Push to the branch (`git push origin feature/new-simulation`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

<!-- Update with your actual information -->

- Your Name - [GitHub Profile](https://github.com/your-username)

---

Created with ❤️ using Next.js, TypeScript, and Three.js
