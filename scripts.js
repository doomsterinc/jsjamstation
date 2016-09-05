(function(){
  // beats per minute
  var BPM = 117;

  // beats per second
  var BPS = 60 / BPM;

  // measures used for count in
  var measuresCount = 1;

  // time the track starts
  var offsetSeconds = 0.2;

  // time signature
  var timeSigTop = 4;
  var timeSigBottom = 4;

  var sectionOne = ['A7', 'A7', 'A7', 'A7', 'D7', 'D7', 'A7', 'A7', 'E7', 'D7', 'A7', 'A7'];
  var sectionTwo = ['A7', 'A7', 'A7', 'A7', 'D7', 'D7', 'A7', 'A7', 'E7', 'D7', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7', 'A7'];

  var chordProgression = [
    sectionOne,
    sectionOne,
    sectionOne,
    sectionTwo
  ];

  var currentSection;
  var currentChord;
  var cleanMeasure;
  var measureBeat;

  // every time the ontimeupdate event fires, run the jam station
  var audio = document.getElementById('jam-track');
  audio.ontimeupdate = function() {
    jamStation();
  };

  function jamStation() {
    var beat = (audio.currentTime - offsetSeconds + BPS) / BPS;
    var measure = (beat - 1) / timeSigTop;

    // round down for beat and measure
    var cleanBeat = Math.floor(beat);
    cleanMeasure = Math.floor(measure);

    // find the current beat within the measure
    measureBeat = ((cleanBeat - 1) % timeSigTop) + 1;

    // set the current chord and section.  s = section, m = measure
    if (cleanMeasure > 0) {
      // find the current section
      var count = 0;
			var br = false;

      for(var s = 0; s < chordProgression.length; s++) {
        for(var m = 0; m < chordProgression[s].length; m++) {
          count++;
          if (cleanMeasure == count) {
            currentSection = s + 1;
            currentChord = chordProgression[s][m];
            br = true;
            break;
          }
        }
        if (br === true) {
          break;
        }
      }
    } else {
      currentSection = null;
      currentChord = null;
    }

    // display the jam staion and it's data
    renderJamStation();
  }

  function renderJamStation() {
    // show the beat within the measure, not overall
    document.getElementById('beat').innerHTML = measureBeat;

    // show the current measure, but only if the jam track is past the count in measures
    var measureElem = document.getElementById('measure');

    // only show the current measure if it's > 0
    if (cleanMeasure > 0) {
      measureElem.innerHTML = cleanMeasure;
    } else {
      measureElem.innerHTML = '';
    }

    // show the section number
    document.getElementById('section').innerHTML = currentSection;
    // show the current chord name
    document.getElementById('chord').innerHTML = currentChord;

    // hide all sections before displaying only the section we want to see
    var allSections = document.getElementsByClassName('section');
    for (var i = 0; i < allSections.length; i++) {
      allSections[i].style.display = 'none';
    }

    // show the currently playing section
    if (currentSection !== null) {
      document.getElementById('section-' + currentSection).style.display = 'block';
    } else {
      allSections[0].style.display = 'block';
    }

    // style the current chord in the chord progression
    if (cleanMeasure > 0) {
      // style all measures black
      var measures = document.getElementsByClassName('measure');
      for (i = 0; i < measures.length; i++) {
         measures[i].style.color = 'black';
      }
      // style current measure red
      document.getElementById('measure-' + cleanMeasure).style.color = 'red';
    }
  }

  // take the chordProgression array and render the HTML
  function renderChordProgression() {
    var progression = document.getElementById('chord-progression');

    // make the sections
    for (s = 0; s < chordProgression.length; s++) {
      progression.innerHTML += '<div class="section" id="section-' + (s + 1) + '"></div>';
    }

    var count = 0;

    for (var s = 0; s < chordProgression.length; s++) {
      for (var m = 0; m < chordProgression[s].length; m++) {
        count++;
        var section = document.getElementById('section-' + (s + 1));
        section.innerHTML += '<div class="measure" id="measure-' + count + '">'
                          + chordProgression[s][m]
                          + '<div class="m-line">|</div></div>';
      }
    }
  }

  renderChordProgression();
  jamStation();
}());
