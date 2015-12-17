$(function(){
  console.log(window.location.pathname)
     if (window.location.pathname == '#/leaderboard') {
         $("#home").click(function(){
           alert('wtf');
         }); 
     }else if(window.location.pathname == '#/home'){
          $("#leaderboard").click(function(){
            alert('message');
          });
   }
});