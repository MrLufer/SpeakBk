const CHART = document.getElementById("lineChart");
console.log("CHART");
var lineChart = new Chart(CHART, {
      type: 'bar',
      data: {
          labels: ["14", "15", "16", "17", "18", "19","20","21","22","23","24","25"],
          datasets: [{
              label: '',
              data: [12, 19, 3, 5, 2, 3,-3,-5,-10],
              backgroundColor: [
                  'rgba(255, 0, 0, 1)', // rojo
                  'rgba(54, 162, 235, 1)' // azul


              ],

              borderWidth: 1
          }]
      },
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero:false
                  }
              }]
          }
      }
  });


  var canvas = document.querySelector('#lineChart');
  var context = canvas.getContext('2d');



  //hidden canvas


  //add event listener to button
  document.getElementById('download-pdf').addEventListener("click", downloadPDF);

  //donwload pdf from original canvas
  function downloadPDF() {
    var canvas = document.querySelector('#lineChart');
  	//creates image
  	var canvasImg = canvas.toDataURL("image/jpeg", 1.0);

  	//creates PDF from img
  	var doc = new jsPDF('landscape');
  	doc.setFontSize(20);
  	doc.text(15, 15, "Cool Chart");
  	doc.addImage(canvasImg, 'JPEG', 10, 10, 280, 150 );
  	doc.save('canvas.pdf');
  }
