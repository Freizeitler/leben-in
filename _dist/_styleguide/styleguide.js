/*jslint browser: true*/ /*global  $*/
'use strict';
$.getJSON( 'config.json', function(data) {
  var title = data.title || '';
  var intro = data.intro || '';
  var content = data.content || '';
  var atoms = content.atoms.patterns || '';
  var molecules = content.molecules.patterns || '';
  var organisms = content.organisms.patterns || '';
  var colors = content.colors.codes || '';
  var typo = content.typo.families || '';

  $('.js-title').html(title);
  $('.js-intro').html(intro);

  // Set up navigation + tree structure
  $.each(content, function(key) {
    $('.js-navigation').append(
      '<li class="js-' + key + '">' +
        '<a href="#' + key + '">' + key + '</a>' +
      '</li>');
    $('.js-content').append(
      '<section id="' + key + '">' +
        '<h2 class="styleguide-h2">' + key + '</h2>' +
        '<p>' + this.description + '</p>' +
      '</section>'+
      '<p class="styleguide-top-link"><a href="#top">to top</a></p>');
  });

  var setNavigation = function(navName, navObject) {
    $.each(navObject, function(key) {
      $('.js-' + navName).append(
        '<ul>' +
          '<li><a href="#' + key + '">' + key + '</a></li>' +
        '</ul>');
    });
  };
  setNavigation('atoms', atoms);
  setNavigation('molecules', molecules);
  setNavigation('organisms', organisms);

  // Set up color boxes
  $.each(colors, function(i, item) {
    $('#colors').append(
      '<div class="styleguide-color-cube" style="background-color: ' + item + ';">' +
        '<div>' + item + '</div>' +
      '</div>');
  });

  // Set up fonts
  $.each(typo, function(key, val) {
    $('#typo').append(
      '<' + key +' class="font-' + key + '" style="font: ' + val + ';">' +
        '&lt;' + key + '&gt; Lorem ipsum dolor sit amet.' +
      '</' + key +'>');
  });


  // Set up sections
  var setSections = function (patternName, patternObject) {

    $.each(patternObject, function(key, val) {
      var template = 
      '<div class="' + key + ' pattern">' +
        '<h3 class="styleguide-h3" id="' + key + '">' + key + '</h3>' +
        '<p>' + val + '</p>' +
        '<iframe class="styleguide-iframe" src="_patterns/' + patternName + '/' + key + '/index.html"></iframe>' +
        '<xmp class="snippet-' + key +' styleguide-xmp"></xmp>' +
      '</div>';

      $('#' + patternName).append(template);

      $.get('_patterns/' + patternName + '/' + key + '/index.html', function(data) {
        var origHTML = $(data).filter('#snippet');
        var innerHTML = origHTML.children().prop('outerHTML');
        $('.snippet-' + key).html(innerHTML);
      });
    });
  };
  setSections('atoms', atoms);
  setSections('molecules', molecules);
  setSections('organisms', organisms);
});
