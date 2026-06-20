document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const tabList = tabs.querySelector('[role="tablist"]');
    const tabLinks = [...tabList.querySelectorAll('[role="tab"]')];
    const panels = [...tabs.querySelectorAll('[role="tabpanel"]')];

    const selectTab = (selectedTab, moveFocus = false) => {
        tabLinks.forEach((tab) => {
            const isSelected = tab === selectedTab;
            tab.setAttribute('aria-selected', isSelected);
            tab.tabIndex = isSelected ? 0 : -1;
        });

        panels.forEach((panel) => {
            panel.hidden = panel.id !== selectedTab.getAttribute('aria-controls');
        });

        if (moveFocus) {
            selectedTab.focus();
        }
    };

    const hashTab = tabLinks.find((tab) => tab.hash === window.location.hash);
    selectTab(hashTab || tabLinks[0]);

    tabLinks.forEach((tab, index) => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            selectTab(tab);
            history.replaceState(null, '', tab.hash);
        });

        tab.addEventListener('keydown', (event) => {
            let nextIndex;

            if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                nextIndex = (index + 1) % tabLinks.length;
            } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                nextIndex = (index - 1 + tabLinks.length) % tabLinks.length;
            } else if (event.key === 'Home') {
                nextIndex = 0;
            } else if (event.key === 'End') {
                nextIndex = tabLinks.length - 1;
            } else {
                return;
            }

            event.preventDefault();
            const nextTab = tabLinks[nextIndex];
            selectTab(nextTab, true);
            history.replaceState(null, '', nextTab.hash);
        });
    });
});
