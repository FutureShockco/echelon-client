import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('uiStore', {
    state: () => ({
        sidebarOpen: ref<boolean>(false),
        colorMenuOpen: ref<boolean>(false),
        darkTheme: ref<boolean>(false),
        themeColor: ref<string>('blue'),
    }),
    actions: {
        toggleSidebar() {
            this.sidebarOpen = !this.sidebarOpen
        },
        toggleColorMenu() {
            this.colorMenuOpen = !this.colorMenuOpen
        },
        toggleTheme() {
            this.darkTheme = !this.darkTheme
        },
        loadTheme() {
            var rememberHighlight = localStorage.getItem(import.meta.env.VITE_APP_NAME + '-highlight');
            if (rememberHighlight) {
                document.body.setAttribute('data-highlight', rememberHighlight);
                var loadHighlight = document.createElement("link");
                loadHighlight.rel = "stylesheet";
                loadHighlight.className = "page-highlight";
                loadHighlight.type = "text/css";
                loadHighlight.href = 'highlights/' + rememberHighlight + '.css';
                if (!document.querySelectorAll('.page-highlight').length) {
                    document.getElementsByTagName("head")[0].appendChild(loadHighlight);
                    document.body.setAttribute('data-highlight', 'highlight-' + rememberHighlight)
                }
            }
        },
        changeColor(color: string) {
            var highlight = color;
            localStorage.setItem(import.meta.env.VITE_APP_NAME + '-highlight', highlight)
            var pageHighlight = document.querySelectorAll('.page-highlight');
            if (pageHighlight.length) { pageHighlight.forEach(function (e) { e.remove(); }); }
            var loadHighlight = document.createElement("link");
            loadHighlight.rel = "stylesheet";
            loadHighlight.className = "page-highlight";
            loadHighlight.type = "text/css";
            loadHighlight.href = 'highlights/' + highlight + '.css';
            document.getElementsByTagName("head")[0].appendChild(loadHighlight);
            document.body.setAttribute('data-highlight', 'highlight-' + highlight)
            this.themeColor = color
        },
    }
});