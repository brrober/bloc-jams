
//require("./landing");
//require("./collection");
//require('./album');
//require("./profile");

//require('./moment.js');
//require('./chart.js');

 // Example Album
 var albumPicasso = {
   name: 'The Colors',
   artist: 'Pablo Picasso',
   label: 'Cubism',
   year: '1881',
   albumArtUrl: '/images/album-placeholder.png',
   songs: [
      { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
      { name: 'Green', length: 105.66 , audioUrl: '/music/placeholders/green' },
      { name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red' },
      { name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink' },
      { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
     ]
 };

var blocJams = angular.module('BlocJams', ['ui.router']);

 blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
   $locationProvider.html5Mode(true);
 
   $stateProvider.state('landing', {
     url: '/',
     controller: 'Landing.controller',
     templateUrl: '/templates/landing.html',
//      onEnter: Analytics.registerPageVisited('home')
   });
 
   $stateProvider.state('collection', {
     url: '/collection',
     controller: 'Collection.controller',
     templateUrl: '/templates/collection.html'
   });
   
     $stateProvider.state('album', {
     url: '/album',
     templateUrl: '/templates/album.html',
     controller: 'Album.controller'
   });
   
    $stateProvider.state('analytics', {
     url: '/analytics',
     controller: 'Analytics.controller',
     templateUrl: '/templates/analytics.html'
   });

 }]);
 
 // This is a cleaner way to call the controller than crowding it on the module definition.

 blocJams.controller('Analytics.controller', ['$scope', 'Analytics', function($scope, Analytics) {
   $scope.subText = moment().format('MMMM Do YYYY');
   $scope.subText2 = moment().format('h:mm a'); 
   Analytics.registerPageVisited('Analytics');
   
 }]);

   
   
   
 blocJams.controller('Landing.controller', ['$scope', 'Analytics', function($scope, Analytics) {
    $scope.subText = "Turn the music up!";
 
  $scope.subTextClicked = function() {
     $scope.subText += '!';
  };
   
       $scope.albumURLs = [
     '/images/album-placeholders/album-1.jpg',
     '/images/album-placeholders/album-2.jpg',
    '/images/album-placeholders/album-3.jpg',
     '/images/album-placeholders/album-4.jpg',
     '/images/album-placeholders/album-5.jpg',
     '/images/album-placeholders/album-6.jpg',
     '/images/album-placeholders/album-7.jpg',
     '/images/album-placeholders/album-8.jpg',
     '/images/album-placeholders/album-9.jpg',
   ];
   Analytics.registerPageVisited('Home');
         }]);

 blocJams.controller('Navigation.controller', ['Analytics', '$scope',  function(Analytics, $scope) {
   $scope.registerPageVisited = Analytics.registerPageVisited;
   
  
   
 }]);
   
   
   
 blocJams.controller('Collection.controller', ['$scope','SongPlayer', 'Analytics', function($scope, SongPlayer, Analytics) {
   $scope.albums = [];
   for (var i = 0; i < 33; i++) {
     $scope.albums.push(angular.copy(albumPicasso));
   }
       
   $scope.playAlbum = function(album){
     SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
   }
   
   Analytics.registerPageVisited('Library');
 }]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'Analytics', function($scope, SongPlayer, Analytics) {
   $scope.album = angular.copy(albumPicasso);
     
   var hoveredSong = null;
 
   $scope.onHoverSong = function(song) {
     hoveredSong = song;
   };
 
   $scope.offHoverSong = function(song) {
     hoveredSong = null;
   };
     
    $scope.getSongState = function(song) {
     if (song === SongPlayer.currentSong && SongPlayer.playing) {
      return 'playing';
    }
    else if (song === hoveredSong) {
      return 'hovered';
    }
    return 'default';
   };
     
     
    $scope.playSong = function(song) {
     SongPlayer.setSong($scope.album, song);
     SongPlayer.play();
    };
 
    $scope.pauseSong = function(song) {
     SongPlayer.pause();
    };
  
     Analytics.registerPageVisited('Playlist');
 }]);
   
 blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', 'Analytics', function($scope, SongPlayer, Analytics) {
   $scope.songPlayer = SongPlayer;

//   $scope.$watch(function(scope) { return SongPlayer.currentSong }, 
//          function(newValue, oldValue) {
//             Analytics.registerSong(SongPlayer.currentSong);
//             }
//          );
                 
   $scope.volumeClass = function() {
     return {
       'fa-volume-off': SongPlayer.volume == 0,
       'fa-volume-down': SongPlayer.volume <= 70 && SongPlayer.volume > 0,
       'fa-volume-up': SongPlayer.volume > 70
     }
   }
   
   SongPlayer.onTimeUpdate(function(event, time){
     $scope.$apply(function(){
       $scope.playTime = time;
     });
   });
 
 }]);
   
 blocJams.service('SongPlayer', ['$rootScope', 'Analytics' ,function($rootScope, Analytics) {
   var currentSoundFile = null;
   var trackIndex = function(album, song) {
     return album.songs.indexOf(song);
   }; 

   return {
     currentSong: null,
     currentAlbum: null,
     playing: false,
     volume: 90,
     muted: false,
     
     play: function() {
      this.playing = true;
      currentSoundFile.play();

     },
     pause: function() {
       this.playing = false;
       currentSoundFile.pause();
     },
     next: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex++;
       if (currentTrackIndex >= this.currentAlbum.songs.length) {
         currentTrackIndex = 0;
       }
      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
       },
     previous: function() {
       var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
       currentTrackIndex--;
       if (currentTrackIndex < 0) {
         currentTrackIndex = this.currentAlbum.songs.length - 1;
       }
       var song = this.currentAlbum.songs[currentTrackIndex];
       this.setSong(this.currentAlbum, song);
     
     },
     mute: function() {
       if (!this.muted) {
         currentSoundFile.mute();
         this.muted = true;
       }
       else {
         console.log("triggered");
         currentSoundFile.unmute();
         this.muted = false;
       }
     },
     
    seek: function(time) {
       // Checks to make sure that a sound file is playing before seeking.
       if(currentSoundFile) {
         // Uses a Buzz method to set the time of the song.
         currentSoundFile.setTime(time);
       }
     },
    onTimeUpdate: function(callback) {
      return $rootScope.$on('sound:timeupdate', callback);
    },

     setVolume: function(volume) {
      if(currentSoundFile){
        currentSoundFile.setVolume(volume);
      }
      this.volume = volume;
    },
      
     setSong: function(album, song) {
    if (currentSoundFile) {
      currentSoundFile.stop();
    }
       this.currentAlbum = album;
       this.currentSong = song;
    Analytics.registerSong(song);
                     
    currentSoundFile = new buzz.sound(song.audioUrl, {
      formats: [ "mp3" ],
      preload: true
    });
 
      currentSoundFile.setVolume(this.volume);       
      currentSoundFile.bind('timeupdate', function(e){
        $rootScope.$broadcast('sound:timeupdate', this.getTime());
      });
  
    this.play();
     }
   };
 }]);
   
 
blocJams.service('Analytics', ['$rootScope', function($rootScope) {
  $rootScope.pagesVisited = {};
  $rootScope.pagesVisited.pageNames = [];
  $rootScope.pagesVisited.visits = [];
  $rootScope.songsPlayed ={};
  $rootScope.songsPlayed.songNames = [];
  $rootScope.songsPlayed.plays = [];
  $rootScope.songsPlayed.totalTime = [];


  var pages = $rootScope.pagesVisited;
  var songInfo = $rootScope.songsPlayed;
  return{
  
    registerPageVisited: function(pageName) {
      var position = pages.pageNames.indexOf(pageName);
      if(position == -1){
        pages.pageNames.push(pageName);
        pages.visits.push(1);
      } else {
        pages.visits[position] = pages.visits[position] +1;
      }

    },
    
    registerSong: function(songName) {
      var position = songInfo.songNames.indexOf(songName.name);
      if(position == -1) {
        songInfo.songNames.push(songName.name);
        songInfo.plays.push(1);
        songInfo.totalTime.push(songName.length);
      } else {
        songInfo.plays[position] = songInfo.plays[position] +1;
        songInfo.totalTime[position] = songInfo.totalTime[position] + songName.length;
      }
   
//      var obj={};
//      obj.songName=songName;
//      obj.songLength=SongPlayer.currentSong.length;
//      obj.playedAt = new Date();
//      $rootScope.songsPlayed.push(obj);
      console.log($rootScope.songsPlayed);
    }
  };
}]);
   
  
  
 blocJams.directive('slider', ['$document', function($document){
 
       
   // Returns a number between 0 and 1 to determine where the mouse event happened along the slider bar.
   var calculateSliderPercentFromMouseEvent = function($slider, event) {
     var offsetX =  event.pageX - $slider.offset().left; // Distance from left
     var sliderWidth = $slider.width(); // Width of slider
     var offsetXPercent = (offsetX  / sliderWidth);
     offsetXPercent = Math.max(0, offsetXPercent);
     offsetXPercent = Math.min(1, offsetXPercent);
     return offsetXPercent;
   }
    var numberFromValue = function(value, defaultValue) {
     if (typeof value === 'number') {
       return value;
     }
 
     if(typeof value === 'undefined') {
       return defaultValue;
     }
 
     if(typeof value === 'string') {
       return Number(value);
     }
   }
 
   
   return {
     templateUrl: '/templates/directives/slider.html', 
     replace: true,
     restrict: 'E',
 // Creates a scope that exists only in this directive.
     scope: {
      onChange: '&'
    },
     
     link: function(scope, element, attributes) {
     // These values represent the progress into the song/volume bar, and its max value.
     // For now, we're supplying arbitrary initial and max values.
     scope.value = 0;
     scope.max = 100;  
       
      var $seekBar = $(element);
  
      attributes.$observe('value', function(newValue) {
        scope.value = numberFromValue(newValue, 0);
      });
 
      attributes.$observe('max', function(newValue) {
        scope.max = numberFromValue(newValue, 100) || 100;
      });
 
 
        scope.onClickSlider = function(event) {
         var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
         scope.value = percent * scope.max;
         notifyCallback(scope.value);
       }
      
      scope.trackThumb = function() {
         $document.bind('mousemove.thumb', function(event){
           var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
           scope.$apply(function(){
             scope.value = percent * scope.max;
             notifyCallback(scope.value);
           });
         });
 
         //cleanup
         $document.bind('mouseup.thumb', function(){
           $document.unbind('mousemove.thumb');
           $document.unbind('mouseup.thumb');
         });
       };
       
       var percentString = function () {
          var value = scope.value || 0;
          var max = scope.max || 100;
          percent = value / max * 100;
         return percent + "%";
       }
 
       scope.fillStyle = function() {
         return {width: percentString()};
       }
 
       scope.thumbStyle = function() {
         return {left: percentString()};
       }
       var notifyCallback = function(newValue) {
         if(typeof scope.onChange === 'function') {
           scope.onChange({value: newValue});
         }
       };
    }
        
   };
 }]);  
   
blocJams.directive('visit', function($rootScope)  {
  
  
  var data ={
    labels: $rootScope.pagesVisited.pageNames,
    datasets: [
      {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.6  )",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: $rootScope.pagesVisited.visits
        }
    ]
        
  };
  return  {
    templateUrl: '/templates/directives/visit.html',
    restrict:  'E',
    link: function(scope, element)  {
      var ctx =  $("#visit-chart").get(0).getContext("2d")
 //         document.getElementById("visit-chart").getContext("2d");
      
      new Chart(ctx).Bar(data);
  }
  };
});
   
   blocJams.directive('songs', function($rootScope)  {


//    $rootScope.songsPlayed.songNames.splice(0,1);
//    $rootScope.songsPlayed.plays.splice(0,1);
//      console.log($rootScope.songsPlayed);
     
  var data ={
    labels: $rootScope.songsPlayed.songNames,
    datasets: [
      {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.6)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: $rootScope.songsPlayed.plays
        }
    ]
        
  };
  return  {
    templateUrl: '/templates/directives/songs.html',
    restrict:  'E',
    link: function(scope, element)  {
      var ctx =  $("#songs-chart").get(0).getContext("2d")

      
      new Chart(ctx).Bar(data);
  }
  };
}); 
   
   blocJams.directive('length', function($rootScope)  {
  
     var data ={
    labels:  $rootScope.songsPlayed.songNames,
    datasets: [
      {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.5)",
            strokeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",
            data: $rootScope.songsPlayed.totalTime
        }
    ]
        
  };
  return  {
    templateUrl: '/templates/directives/length.html',
    restrict:  'E',
    link: function(scope, element)  {
      var ctx =  $("#length-chart").get(0).getContext("2d")

      
      new Chart(ctx).Bar(data);
  }
  };  
});
   
 blocJams.filter('timecode', function(){
   return function(seconds) {
     seconds = Number.parseFloat(seconds);
 
     // Returned when no time is provided.
     if (Number.isNaN(seconds)) {
       return '-:--';
     }
 
     // make it a whole number
     var wholeSeconds = Math.floor(seconds);
 
     var minutes = Math.floor(wholeSeconds / 60);
 
     remainingSeconds = wholeSeconds % 60;
 
     var output = minutes + ':';
 
     // zero pad seconds, so 9 seconds should be :09
     if (remainingSeconds < 10) {
       output += '0';
     }
 
     output += remainingSeconds;
 
     return output;
   }
 });