import * as homeController from './pokemon.js'; 
import * as digiController from './secret.js'; 

const router = {
    routes: {
        home: {
            hash: '#home',
            controller: homeController // Assign the home controller module to the home route
        },
        digimon: {
            hash: '#digimon',
            controller: digiController // Assign the same controller module for the pokemonGame route
        },
        
    },

    start() {
        this.routes.home.controller.init(); // Call the init function of the home controller module

        $(window).on("hashchange", () => {
            try {
                this.getRoute(this.routes);
            } catch (err) {
                window.location.hash = "#home";
                this.routes.home.controller.init();
            }
        });
    },

    getRoute(routes) {
        const hash = window.location.hash;
        const route = Object.values(routes).find(route => route.hash === hash);
        if (route) {
            this.loadController(route.controller);
        } else {
            console.log('Route not found');
        }
    },

    async loadController(controller) {
        try {
            const module = await import(`./${controller}`);
            module.init(); // Assuming each controller exports an init function
        } catch (error) {
            console.error('Error loading controller:', error);
        }
    }
};

// Export the router object
export default router;

// Initialize the router
router.start(); 
