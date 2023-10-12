//tab.js
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll('[data-tab] .tab-title');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", function (event) {
        event.preventDefault();
    
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
    
        tabContents.forEach((content) => content.classList.remove('active'));
        tabContents[index].classList.add('active');
      });
    });
});