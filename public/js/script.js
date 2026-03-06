// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const input = document.querySelector("#search-input");
const suggestions = document.querySelector("#suggestions");

input.addEventListener("keyup", async () => {

    let query = input.value;

    if(query.length === 0){
        suggestions.innerHTML = "";
        return;
    }

    let res = await fetch(`/listings/suggestions?q=${query}`);
    let data = await res.json();

    suggestions.innerHTML = "";

    data.forEach(listing => {

        let div = document.createElement("div");
        div.classList.add("suggestion-item");
        div.innerText = listing.title;

        div.addEventListener("click", () => {
            input.value = listing.title;
            suggestions.innerHTML = "";
        });

        suggestions.appendChild(div);

    });

});
