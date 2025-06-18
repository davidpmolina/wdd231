document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle buttons
    const toggleButtons = document.querySelectorAll('.wireframe-toggle .toggle-button');

    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the parent .wireframe-toggle div
            const parentToggle = this.closest('.wireframe-toggle');
            // Get the .wireframe-content div within this parent
            const content = parentToggle.querySelector('.wireframe-content');
            // Get the arrow span within this button
            const arrow = this.querySelector('.arrow');

            // Toggle the 'show' class on the content
            content.classList.toggle('show');

            // Rotate the arrow icon
            if (content.classList.contains('show')) {
                arrow.style.transform = 'rotate(180deg)';
            } else {
                arrow.style.transform = 'rotate(0deg)';
            }
        });
    });
});