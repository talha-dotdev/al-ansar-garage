// ===== HAMBURGER MENU =====
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navBtn = document.querySelector('.nav-btn');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('active');
    navBtn.classList.toggle('active');
    document.body.classList.toggle('menu-open');
});

// Close menu when a nav link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
        navBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const navContainer = document.querySelector('.nav-container');
    if (!navContainer.contains(e.target) && navbar.classList.contains('active')) {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
        navBtn.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
});

/*=========================================
TESTIMONIAL SLIDER
=========================================*/

const cards = document.querySelectorAll(".testimonial-card");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");

if(cards.length){

    let current = 0;

    function showSlide(index){

        cards.forEach(card=>{

            card.classList.remove("active");

        });

        dots.forEach(dot=>{

            dot.classList.remove("active");

        });

        cards[index].classList.add("active");
        dots[index].classList.add("active");

    }

    nextBtn.addEventListener("click",()=>{

        current++;

        if(current >= cards.length){

            current = 0;

        }

        showSlide(current);

    });

    prevBtn.addEventListener("click",()=>{

        current--;

        if(current < 0){

            current = cards.length - 1;

        }

        showSlide(current);

    });

    dots.forEach((dot,index)=>{

        dot.addEventListener("click",()=>{

            current = index;

            showSlide(current);

        });

    });

    setInterval(()=>{

        current++;

        if(current >= cards.length){

            current = 0;

        }

        showSlide(current);

    },5000);

}

/*FAQ*/
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    question.addEventListener("click", () => {

        if(item.classList.contains("active")){

            item.classList.remove("active");
            answer.style.maxHeight = null;
            return;

        }

        faqItems.forEach(faq=>{

            faq.classList.remove("active");
            faq.querySelector(".faq-answer").style.maxHeight = null;

        });

        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";

    });

});