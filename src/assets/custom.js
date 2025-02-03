
document.addEventListener("readystatechange", (event) => {
    if (document.readyState === 'complete')
        setTimeout(() => {
            init_template()
        }, 1000);
})

document.addEventListener('DOMContentLoaded', () => {
    init_template()

})

var appName = import.meta.env.VITE_APP_NAME; //Local Storage Name
function init_template() {
    //Caching Global Variables
    var i, e, el, evt, event; //https://www.w3schools.com/js/js_performance.asp
    //Don't jump on Empty Links
    const emptyHref = document.querySelectorAll('a[href="#"]')
    emptyHref.forEach(el => el.addEventListener('click', e => {
        e.preventDefault();
        return false;
    }));



    //Remove Overflow from Body on Load
    document.body.setAttribute('style', '');

    //Back Button
    const backButton = document.querySelectorAll('[data-back-button]');
    if (backButton.length) {
        backButton.forEach(el => el.addEventListener('click', e => {
            e.stopPropagation;
            e.preventDefault;
            window.history.go(-1);
        }));
    }
    //Back to Top
    const backToTop = document.querySelectorAll('.back-to-top-icon, .back-to-top-badge, .back-to-top');
    if (backToTop.length) {
        backToTop.forEach(el => el.addEventListener('click', e => {
            window.scrollTo({ top: 0, behavior: `smooth` })
        }));
    }
    //Auto Activate OffCanvas
    var autoActivateMenu = document.querySelectorAll('[data-auto-activate]')[0];
    if (autoActivateMenu) {
        setTimeout(function () {
            var autoActivate = new bootstrap.Offcanvas(autoActivateMenu)
            autoActivate.show();
        }, 600)
    }

    //Open Offcanvas and Hide Automatically
    var autoHide = document.querySelectorAll('[data-auto-hide-target]')
    autoHide.forEach(el => el.addEventListener('click', e => {
        var offCanvasID = el.getAttribute('data-auto-hide-target');
        var offCanvasTime = el.getAttribute('data-auto-hide-time');
        var autoHideMenu = document.querySelectorAll(offCanvasID)[0];
        var canvasIdenter = new bootstrap.Offcanvas(autoHideMenu);
        canvasIdenter.show();
        setTimeout(function () {
            canvasIdenter.hide();
        }, offCanvasTime)
    }));

   
    //Dark Mode
    function darkMode() {
        var toggleDark = document.querySelectorAll('[data-toggle-theme]');
        function activateDarkMode() {
            document.getElementById('theme-check').setAttribute('content', '#1f1f1f')
            document.body.classList.add('theme-dark');
            document.body.classList.remove('theme-light', 'detect-theme');
            for (let i = 0; i < toggleDark.length; i++) { toggleDark[i].checked = "checked" };
            localStorage.setItem(appName + '-theme', 'dark-mode');
            // console.log('dark');
        }
        function activateLightMode() {
            document.getElementById('theme-check').setAttribute('content', '#FFFFFF')
            document.body.classList.add('theme-light');
            document.body.classList.remove('theme-dark', 'detect-theme');
            for (let i = 0; i < toggleDark.length; i++) { toggleDark[i].checked = false };
            localStorage.setItem(appName + '-theme', 'light-mode');
            // console.log('light');
        }

        function setColorScheme() {
            const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
            const isLightMode = window.matchMedia("(prefers-color-scheme: light)").matches
            const isNoPreference = window.matchMedia("(prefers-color-scheme: no-preference)").matches
            window.matchMedia("(prefers-color-scheme: dark)").addListener(e => e.matches && activateDarkMode())
            window.matchMedia("(prefers-color-scheme: light)").addListener(e => e.matches && activateLightMode())
            if (isDarkMode) activateDarkMode();
            if (isLightMode) activateLightMode();
        }

        //Activating Dark Mode
        var darkModeSwitch = document.querySelectorAll('[data-toggle-theme]')
        darkModeSwitch.forEach(el => el.addEventListener('click', e => {
            if (document.body.className == "theme-light") { removeTransitions(); activateDarkMode(); }
            else if (document.body.className == "theme-dark") { removeTransitions(); activateLightMode(); }
            setTimeout(function () { addTransitions(); }, 350);
        }));

        //Set Color Based on Remembered Preference.
        if (localStorage.getItem(appName + '-theme') == "dark-mode") { for (let i = 0; i < toggleDark.length; i++) { toggleDark[i].checked = "checked" }; document.body.className = 'theme-dark'; }
        if (localStorage.getItem(appName + '-theme') == "light-mode") { document.body.className = 'theme-light'; } if (document.body.className == "detect-theme") { setColorScheme(); }

        //Detect Dark/Light Mode
        const darkModeDetect = document.querySelectorAll('.detect-dark-mode');
        darkModeDetect.forEach(el => el.addEventListener('click', e => {
            document.body.classList.remove('theme-light', 'theme-dark');
            document.body.classList.add('detect-theme')
            setTimeout(function () { setColorScheme(); }, 50)
        }))

        function removeTransitions() { var falseTransitions = document.querySelectorAll('.btn, .header, #footer-bar, .menu-box, .menu-active'); for (let i = 0; i < falseTransitions.length; i++) { falseTransitions[i].style.transition = "all 0s ease"; } }
        function addTransitions() { var trueTransitions = document.querySelectorAll('.btn, .header, #footer-bar, .menu-box, .menu-active'); for (let i = 0; i < trueTransitions.length; i++) { trueTransitions[i].style.transition = ""; } }
    }

    //OTP Boxes
    var otp = document.querySelectorAll('.otp');
    if (otp[0]) {
        otp.forEach(el => {
            el.addEventListener('focus', (e) => { el.value = ""; })
            el.addEventListener('input', (e) => { el.nextElementSibling ? el.nextElementSibling.focus() : el.blur(); });
        });
    }

    //File Upload
    const inputArray = document.getElementsByClassName('upload-file');
    if (inputArray.length) {
        inputArray[0].addEventListener('change', prepareUpload, false);
        function prepareUpload(event) {
            if (this.files && this.files[0]) {
                var img = document.getElementById('image-data');
                img.src = URL.createObjectURL(this.files[0]);
                img.classList.add('mt-4', 'mb-3', 'mx-auto');
            }
            const files = event.target.files;
            const fileName = files[0].name;
            const fileSize = (files[0].size / 1000).toFixed(2) + 'kb';
            const textBefore = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-before');
            const textAfter = document.getElementsByClassName('upload-file-name')[0].getAttribute('data-text-after');
            document.getElementsByClassName('upload-file-name')[0].innerHTML = textBefore + ' ' + fileName + ' - ' + fileSize + ' - ' + textAfter;
            document.getElementsByClassName('upload-file-name')[0].classList.add('pb-3');
        }

    }

    //Adding Local Storage for Visited Links
    var checkVisited = document.querySelectorAll('.check-visited');
    if (checkVisited.length) {
        function check_visited_links() {
            var visited_links = JSON.parse(localStorage.getItem(appName + '_Visited_Links')) || [];
            var links = document.querySelectorAll('.check-visited a');
            for (let i = 0; i < links.length; i++) {
                var that = links[i];
                that.addEventListener('click', function (e) {
                    var clicked_url = this.href;
                    if (visited_links.indexOf(clicked_url) == -1) {
                        visited_links.push(clicked_url);
                        localStorage.setItem(appName + '_Visited_Links', JSON.stringify(visited_links));
                    }
                })
                if (visited_links.indexOf(that.href) !== -1) {
                    that.className += ' visited-link';
                }
            }
        }
        check_visited_links();
    }

    //Stepper
    var stepperAdd = document.querySelectorAll('.stepper-add');
    var stepperSub = document.querySelectorAll('.stepper-sub');
    if (stepperAdd.length) {
        stepperAdd.forEach(el => el.addEventListener('click', event => {
            var currentValue = el.parentElement.querySelector('input').value
            el.parentElement.querySelector('input').value = +currentValue + 1
        }))

        stepperSub.forEach(el => el.addEventListener('click', event => {
            var currentValue = el.parentElement.querySelector('input').value
            if (currentValue >= 1) {
                el.parentElement.querySelector('input').value = +currentValue - 1
            }
        }))
    }



    //Toasts
    var toastTrigger = document.querySelectorAll('[data-toast]');
    if (toastTrigger.length) {
        toastTrigger.forEach(el => el.addEventListener('click', event => {
            document.querySelectorAll('.toast, .snackbar, .notification-bar').forEach(el => { el.classList.remove('show') })
            var toastData = el.getAttribute('data-toast')
            var notificationToast = document.getElementById(toastData);
            var notificationToast = new bootstrap.Toast(notificationToast);
            notificationToast.show();
        }));
    }

    var toastDismiss = document.querySelectorAll('[data-bs-dismiss="toast"]');
    toastDismiss.forEach(el => {
        el.addEventListener('click', (e) => {
            var notificationBar = document.querySelectorAll('.notification-bar');
            notificationBar.forEach(el => {
                el.classList.remove('show');
            });

        });
    });


    //Dropdown
    var dropdownElementList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'))
    if (dropdownElementList.length) {
        var dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
            return new bootstrap.Dropdown(dropdownToggleEl);
        })
    }

    //Form Validation
    var bootstrapForms = document.querySelectorAll('.needs-validation')
    // Loop over them and prevent submission
    Array.prototype.slice.call(bootstrapForms).forEach(function (bootstrapForms) {
        bootstrapForms.addEventListener('submit', function (event) {
            if (!bootstrapForms.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            } else {
                //Remove the code below to allow form submission.
                event.preventDefault();
                event.stopPropagation();
                qrFunction(event);
            }
            bootstrapForms.classList.add('was-validated')
        }, false)
    })

    //Form Label Activate on Write
    var formLabel = document.querySelectorAll('.form-label input, .form-label select, .form-label textarea');
    formLabel.forEach(el => el.addEventListener('input', event => {
        if (el.value == '') { el.parentElement.querySelectorAll('label')[0].classList.remove('form-label-active'); }
        if (el.value !== '') { el.parentElement.querySelectorAll('label')[0].classList.add('form-label-active') }
    }));


    // let isMobile = {
    //     Android: function () { return navigator.userAgent.match(/Android/i); },
    //     iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    //     any: function () { return (isMobile.Android() || isMobile.iOS()); }
    // };
    // function iOSversion() { if (/iP(hone|od|ad)/.test(navigator.platform)) { var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/); return [parseInt(v[1], 10)]; } }


    // const androidDev = document.getElementsByClassName('show-android');
    // const iOSDev = document.getElementsByClassName('show-ios');
    // const noDev = document.getElementsByClassName('show-no-device');

    // if (!isMobile.any()) {
    //     for (let i = 0; i < iOSDev.length; i++) { iOSDev[i].classList.add('disabled'); }
    //     for (let i = 0; i < androidDev.length; i++) { androidDev[i].classList.add('disabled'); }
    // }
    // if (isMobile.iOS()) {
    //     for (let i = 0; i < noDev.length; i++) { noDev[i].classList.add('disabled'); }
    //     for (let i = 0; i < androidDev.length; i++) { androidDev[i].classList.add('disabled'); }
    // }
    // if (isMobile.Android()) {
    //     for (let i = 0; i < iOSDev.length; i++) { iOSDev[i].classList.add('disabled'); }
    //     for (let i = 0; i < noDev.length; i++) { noDev[i].classList.add('disabled'); }
    // }

    darkMode();
}
