let filters = document.querySelectorAll(".filter");
// console.log(q);
for(filter of filters){
    filter.addEventListener("click",()=>{
        console.dir(this);
    });
}