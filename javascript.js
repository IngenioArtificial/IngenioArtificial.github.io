window.addEventListener('load', function() {
  var centeredDiv = document.getElementById('centered-div');
  var textElement = centeredDiv.querySelector('p');
  
  // Adjust the width and height of the div based on the text content
  centeredDiv.style.width = textElement.offsetWidth + 'px';
  centeredDiv.style.height = textElement.offsetHeight + 'px';
});