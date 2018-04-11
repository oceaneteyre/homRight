import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Platform } from 'ionic-angular';
/**
 * Generated class for the JeuModelisationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

declare var jQuery:any;
declare var $:any;
import 'jquery-ui-dist/jquery-ui';
//declare var lignes;
//declare var colonnes;
//declare var test;
@IonicPage()
@Component({
  selector: 'page-jeu-modelisation',
  templateUrl: 'jeu-modelisation.html',
})
export class JeuModelisationPage {
cloneCount = 1;
ligne: number = 5;
colonne:number=5;
PosTotal:any;
superficie =0;
largeur =0;
longueur =0;

  constructor(public plt: Platform, private screenOrientation : ScreenOrientation, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
  	if (this.plt.is('mobile')) {
      	// Uniquement affiché pour les mobiles
      	console.log('I am a mobile device!');
	    //this.lockScreenOrientation();
    }
    if (this.plt.is('core')) {
      // uniquement affiché pour le desktop
      console.log('I am a core device!');
    }
     // console.log("test .js : "+colonnes);
    this.PosTotal = $(".ligne-sol").offset(); 
    console.log("top : "+this.PosTotal.top+" + left : "+ this.PosTotal.left);
    this.touchJquery();
    this.tailleSol();
    this.MaisonDeplace();
    this.ActiveDraggable();
    this.InitCache();
    
  }


  InitCache(){
    $(".fond-cache").css("display", "none");
  }

  superficiePiece(){
    this.largeur = Number((this.colonne*0.6).toFixed(2));
    this.longueur = Number((this.ligne*0.6).toFixed(2));
    this.superficie = Number((this.largeur * this.longueur).toFixed(2));

  }

  MaisonDeplace(){
    // Fonction qui permet à la maison d'etre déplacée
    this.touchJquery(); //Déplacement sur telephone possible
    $(".ligne-sol")
      .draggable({
      grid: [ 60, 60],
        stop: function( event, ui ) {       
        this.PosTotal = $(this).position();                
        console.log("top : "+this.PosTotal.top+" + left : "+ this.PosTotal.left);
        $(this).attr('position-x', + this.PosTotal.left);
        $(this).attr('position-y', +this.PosTotal.top);
        $('.cache').hide();
     }    
      })
      
      .on("mouseover", function(){
        $( this ).addClass("move-cursor")
      })

      .on("mousedown", function(){
        $( this )
          .removeClass("move-cursor")
          .addClass("grab-cursor")
          .addClass("opac");
      
      })

      .on("mouseup", function(){
        $( this )
          .removeClass("grab-cursor")
          .removeClass("opac")
          .addClass("move-cursor");
      });
  }

  ActiveDraggable(){
    $( "#snaptarget" ).droppable({
      accept: ".spare-item2",
      over: function(event, ui) {
          $(".spare-item2").draggable({
              grid: [5, 5]
          });
      }

    });

  }; 



  validerTaille(){
    $(".fond-cache").css("display", "flex");
    $(".contenu-taille").css("display", "none");
    $("#case-maison").addClass("case-maison3d");
    $(".resize").addClass("inactive");
    $(".cube").removeClass("inactive").addClass("active");
    $(".mur, .mur2").removeClass("mur-cache").addClass("mur-visible");  
  }


  returnChoose(){
    $(".lightbox-cache").css("display", "none");
  } 

  caseMaisonObjet(event){
    var enfantCaseSol = $('.actions').find('.spare-item'); //Definit la variable
    var countDrag =0;
    $('.cache').hide();
    if(enfantCaseSol.length > 0) //
      { 
        $('.actions').find('.spare-item').remove(); // Suppression de l'enfant
      }
    console.log(event.target.id);
    $( "#"+event.target.id ).clone().attr('id', this.cloneCount++).removeClass( "objets-presentation" ).appendTo(".actions").addClass("spare-item") 
    .draggable({
      //grid: [ 10, 10 ],
      // containment: "#case-maison",
      cursor: "grab",
      //cursorAt: { left: 10, top:10 },
      //revert: 'invalid',
      drag: function (event, ui) {
        //$(this).draggable( "option", "refreshPositions", true );
        //console.log("top : "+ui.offset.top+" + left : "+ui.offset.left);
         if(countDrag==1){
          this.PosTotal = $(".ligne-sol").offset();
          ui.position.left = ui.position.left - this.PosTotal.left;   
          ui.position.top = ui.position.top - this.PosTotal.top;
        }      

      },
      start: function (event, ui) { 
        $(".cache").hide(); 
        countDrag++;
        $(this).attr('symetrie', + "1");
        //if (outside==true) {
        $(this).removeClass("spare-item");
        $(this).addClass("spare-item2");
        //$(this).insertBefore("#case-maison");
        var positionP = $(this).find('.buttonSymetrie'); //Definit la variable
        if(positionP.length == 0){
          if( $(this).hasClass( "sans-symetrie" )==true){
             $(this).append("<img class='buttonVoir cache' src='../../assets/button/see.png'/>");
          }else{
          $(this).append("<img class='buttonSymetrie cache' src='../../assets/button/rotate.png'/><img class='buttonVoir cache' src='../../assets/button/see.png'/>").promise().done(

            function(){

              $(this).on('click', '.buttonSymetrie', function() {
                //Function permettant de changer la symétrie de l'objet
                  console.log('Activation symetrie');
                  var matrice1 = $(this).parent().css("transform");
                  var scx =parseInt(matrice1.split(",")[0].substring(7))*(-1) ;
                  if(scx== -1 || scx == 1){
                    $(this).parent().css({
                      "transform": "scaleX("+scx+")"
                      });
                      $(this).parent().attr('symetrie', + scx);
                  }else{
                     $(this).parent().css(
                      {
                      "transform": "scaleX(-1)"
                      });
                     $(this).parent().attr('symetrie', + "-1");
              }});

              $(this).on('click', '.buttonVoir', function() {
                //Function permettant d'activer le pop up 
                  console.log('Activation pop up');
                  $(".lightbox-cache").css("display", "flex");
              })


            });    
        }
        }
           
      },
      beforeStop:function(event,ui){
        
       // console.log("test");
      },

      stop: function(event,ui){
        $(this).insertBefore("#case-maison");
        $(this).attr('position-x', + ui.position.left);
        $(this).attr('position-y', + ui.position.top);

        //$(this).draggable('option','revert','invalid');
        
      }

    })
    .on('click', function() {
      // if( $(this).children().is( ':visible' ) ){
      //   $(this).find('.cache').hide(); 
      // }else{
      //   $(this).find('.cache').show(); 
      // }
      $(".cache").not($(this)).hide(); 
      $(this).find('.cache').show(); 
    }) 

  }

  tailleSol(){
    console.log("colonne : "+ this.colonne);
    $('.case-sol').attr('colonne', + this.colonne).attr('ligne', +this.ligne);
    $('.case-sol, .actions').width(this.colonne*160-2+"px");

    $('.case-sol, #case-maison, .actions').height(this.ligne*60-2+"px"); 
    $('#case-maison').width(this.colonne*60-2+"px");
    $('.mur').width(this.ligne*50-10+"px");

    $('.mur').css({"left": (-((this.ligne-1)*25)-15)+(((this.colonne-1)*8))+"px"});
    $('.mur').css({"top": (((this.ligne-1)*29.85)-358)-(((this.colonne-1)*12.7))+"px"});


    $('.mur2').width(this.colonne*50-10+this.colonne*3+"px");
    $('.mur2').css({"left": (((this.colonne-1)*3.55)+24)+((this.ligne-1)*20.45)+"px"});
    $('.mur2').css({"top": (((this.ligne-1)*17.5)-358)+"px"});
    this.superficiePiece();
    //$('#case-maison').height(this.ligne*60-2+"px");
  }

  getCurrentScreenOrientation(){
  	// Connaitre l'orientation actuelle de l'écran (exemple : portrait)
  	console.log(this.screenOrientation.type);
  }


  lockScreenOrientation(){
  	//bloquer l'orientation de l'écran en paysage
  	this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }


  unlockScreenOrientation(){
  	//débloquer toutes les orientations de l'écran
  	this.screenOrientation.unlock();
  }

  activationBoutton(){
  	 $('#elements').addClass('elements-active');
  	 $('#elements').removeClass('elements');

  	 $('#contenuPrincipal').addClass('contenu-actif');
  	 $('#contenuPrincipal').removeClass('contenu');

  	 $('.container').removeClass('container-inactif');
  	 $('.container').addClass('container-actif');

  	 $('.activated').addClass('segment-activated');
     $(".spare-item2").find('.cache').hide();
  }

  desactiveBoutton(){
  	$('#elements').removeClass('elements-active');
  	$('#elements').addClass('elements');

  	 $('#contenuPrincipal').addClass('contenu');
  	 $('#contenuPrincipal').removeClass('contenu-actif');

  	 $('.container').removeClass('container-actif');
  	 $('.container').addClass('container-inactif');

  	$('.segment-button').removeClass('segment-activated');
  	$('.segment-button').attr('aria-pressed', 'false');
  }


   /*!
   * jQuery UI Touch Punch 0.2.3
   */
  touchJquery() {(function ($) {

    // Detect touch support
    $.support.touch = 'ontouchend' in document;

    // Ignore browsers without touch support
    if (!$.support.touch) {
      return;
    }

    var mouseProto = $.ui.mouse.prototype,
        _mouseInit = mouseProto._mouseInit,
        _mouseDestroy = mouseProto._mouseDestroy,
        touchHandled;

    /**
     * Simulate a mouse event based on a corresponding touch event
     * @param {Object} event A touch event
     * @param {String} simulatedType The corresponding mouse event
     */
    function simulateMouseEvent (event, simulatedType) {

      // Ignore multi-touch events
      if (event.originalEvent.touches.length > 1) {
        return;
      }

      event.preventDefault();

      var touch = event.originalEvent.changedTouches[0],
          simulatedEvent = document.createEvent('MouseEvents');
      
      // Initialize the simulated mouse event using the touch event's coordinates
      simulatedEvent.initMouseEvent(
        simulatedType,    // type
        true,             // bubbles                    
        true,             // cancelable                 
        window,           // view                       
        1,                // detail                     
        touch.screenX,    // screenX                    
        touch.screenY,    // screenY                    
        touch.clientX,    // clientX                    
        touch.clientY,    // clientY                    
        false,            // ctrlKey                    
        false,            // altKey                     
        false,            // shiftKey                   
        false,            // metaKey                    
        0,                // button                     
        null              // relatedTarget              
      );

      // Dispatch the simulated event to the target element
      event.target.dispatchEvent(simulatedEvent);
    }

    /**
     * Handle the jQuery UI widget's touchstart events
     * @param {Object} event The widget element's touchstart event
     */
    mouseProto._touchStart = function (event) {

      var self = this;

      // Ignore the event if another widget is already being handled
      if (touchHandled || !self._mouseCapture(event.originalEvent.changedTouches[0])) {
        return;
      }

      // Set the flag to prevent other widgets from inheriting the touch event
      touchHandled = true;

      // Track movement to determine if interaction was a click
      self._touchMoved = false;

      // Simulate the mouseover event
      simulateMouseEvent(event, 'mouseover');

      // Simulate the mousemove event
      simulateMouseEvent(event, 'mousemove');

      // Simulate the mousedown event
      simulateMouseEvent(event, 'mousedown');
    };

    /**
     * Handle the jQuery UI widget's touchmove events
     * @param {Object} event The document's touchmove event
     */
    mouseProto._touchMove = function (event) {

      // Ignore event if not handled
      if (!touchHandled) {
        return;
      }

      // Interaction was not a click
      this._touchMoved = true;

      // Simulate the mousemove event
      simulateMouseEvent(event, 'mousemove');
    };

    /**
     * Handle the jQuery UI widget's touchend events
     * @param {Object} event The document's touchend event
     */
    mouseProto._touchEnd = function (event) {

      // Ignore event if not handled
      if (!touchHandled) {
        return;
      }

      // Simulate the mouseup event
      simulateMouseEvent(event, 'mouseup');

      // Simulate the mouseout event
      simulateMouseEvent(event, 'mouseout');

      // If the touch interaction did not move, it should trigger a click
      if (!this._touchMoved) {

        // Simulate the click event
        simulateMouseEvent(event, 'click');
      }

      // Unset the flag to allow other widgets to inherit the touch event
      touchHandled = false;
    };

    /**
     * A duck punch of the $.ui.mouse _mouseInit method to support touch events.
     * This method extends the widget with bound touch event handlers that
     * translate touch events to mouse events and pass them to the widget's
     * original mouse event handling methods.
     */
    mouseProto._mouseInit = function () {
      
      var self = this;

      // Delegate the touch handlers to the widget's element
      self.element.bind({
        touchstart: $.proxy(self, '_touchStart'),
        touchmove: $.proxy(self, '_touchMove'),
        touchend: $.proxy(self, '_touchEnd')
      });

      // Call the original $.ui.mouse init method
      _mouseInit.call(self);
    };

    /**
     * Remove the touch event handlers
     */
    mouseProto._mouseDestroy = function () {
      
      var self = this;

      // Delegate the touch handlers to the widget's element
      self.element.unbind({
        touchstart: $.proxy(self, '_touchStart'),
        touchmove: $.proxy(self, '_touchMove'),
        touchend: $.proxy(self, '_touchEnd')
      });

      // Call the original $.ui.mouse destroy method
      _mouseDestroy.call(self);
    };

  })(jQuery)};



}