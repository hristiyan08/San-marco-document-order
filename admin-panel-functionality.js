document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.properties');
    const contentDivs = document.querySelectorAll('[name="action-menu"]');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Hide all content divs
            contentDivs.forEach(div => {
                div.style.display = 'none';
            });

            // Get the target content div's id from the data-target attribute
            const targetId = this.getAttribute('data-target');
            const targetDiv = document.getElementById(targetId);

            // Show the corresponding content div
            if (targetDiv) {
                targetDiv.style.display = 'block';
            }
        });
    });

    document.getElementById("exit-profile").addEventListener("click", function(){
        localStorage.removeItem('password');
        document.getElementById("login").style.display = "block"; 
        document.getElementById("menu").style.display = "none";
        location.reload(); 
    });
});
