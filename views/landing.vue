<% include partials/header %>
<!doctype html>
<html lang="en">
  <head>
    <!-- Required meta tags -->
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">

    <title>TopDoc</title>
    <style>
      .speciality {
        margin: 1em;
        width: 9rem;
        float: left;
       ;
        
      }
      .abschnitt {
        margin-top: 2rem;
        padding: 2rem;
      }
    </style>
  </head>
  <body>
    <div class="jumbotron" style="background-color: #e4f7f7;">
      <h1 class="display-4">Topdoc</h1>
      <p class="lead">Finde und buche deinen Arzttermin online</p>
      <hr class="my-4">
      <p></p>
      <a class="btn btn-light" href="/docs" role="button">Mehr erfahren</a>
    </div>





    <div class="abschnitt">
      <form>
        <div class="form-row">
          <div class="col">
            <input type="text" class="form-control" placeholder="Symptom, Behandlung, Arzt">
          </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="Ort oder PLZ">
          </div>
          <div class="col">
            <input type="text" class="form-control" value="13.04.2020">
          </div>
          <div class="col">
            <input type="text" class="form-control" placeholder="Versicherung">
          </div>
          <a type="button" class="btn btn-info" href="/docs">Suche</a>
        </div>
      </form>

    <div style="margin-top: 5rem;">
      <h1>Beliebte Fachrichtungen</h1>
      <div id="app">
        <speciality />
      </div>






    <!-- Optional JavaScript -->
    <!-- jQuery first, then Popper.js, then Bootstrap JS -->
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  </body>
<!--
  <div class='speciality card' href='/docs'>
    <img src='https://d1uhlocgth3qyq.cloudfront.net/primarycare-foreground___3vr-_.svg' class='card-img-top' alt='...'>
    <div class='card-body'>
      <a href="/docs" class="text-warning stretched-link">Hausarzt</a>
    </div>
          <h1>Vue Demo #1</h1>
      <div id="vapp">
        <colored-box />
      </div>
    
    

    <script>
      Vue.component('ColoredBox', {
        template: "<div class='speciality card' href='/docs'><img src='https://d1uhlocgth3qyq.cloudfront.net/primarycare-foreground___3vr-_.svg' class='card-img-top' alt='...'><div class='card-body'><a href='/docs' class='text stretched-link'>Hausarzt</a></div></div>"
      })
  
  
      const vueApp = new Vue({
        el: '#vapp',
        data: { 
  
        }
      })
      </script>
  </div>-->

<% include partials/footer %>