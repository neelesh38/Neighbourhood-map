var locations=[
      {
			  title: 'Jagannath Temple',
			 location:{
				  lat: 19.8047181,
          lng: 85.8179802,
        },
        show:true,
        selected:false,

		  },
		  {
			  title: 'Konark Sun Temple',
			  location:{
          lat: 19.8875953,
          lng: 86.0945364,
        },
        show:true,
        selected:false,
        id:'4cbdd05b3481199c2ecc6d3f'
		  },
      {
			  title: 'Chilika Lake',
			  location:{
          lat: 19.8450,
         lng: 85.4788,
       },
       show:true,
       selected:false,
       id:' '
		  },
		  {
			  title: 'Puri Beach',
			  location:{
          lat: 19.7947,
          lng: 85.8253,
        },
        show:true,
        selected:false,
		    id:'4cfb649ac671721e4959c318'
		  },
      {
			  title: 'Rajarani Temple',
			  location:{
          lat: 20.2434,
          lng: 85.8435,
        },
        show:true,
        selected:false,
		    id:'4cfb649ac671721e4959c318'
		  }


];


var markers=[];
var viewModel=function(){
  var largeInfowindow = new google.maps.InfoWindow();
for(var i=0;i<locations.length;i++)
{
  var position=locations[i].location;
  var title=locations[i].title;
  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');
  var marker=new google.maps.Marker({
    map:map,
    position:position,
    title:title,
    animation:google.maps.Animation.DROP,
    icon:defaultIcon,
	  show:ko.observable(locations[i].show),
	  selected:ko.observable(locations[i].selected),
	  venue:locations[i].id,
    rating:'',
    likes:''
  })
  markers.push(marker);


  //rating of the place

  markers.forEach(function(marker){
    $.ajax({
      method:'GET',
      dataType:'json',
      url:'https://api.foursquare.com/v2/venues/'+marker.venue+'?client_id=ZNBWSBOKCVOK4KML4XW0XVSSPXXGLVP3UEPOQVHE1T5YSB1E&client_secret=F2CLYORZCNBNNDIUVZATCZQW5DRUWFQHMZFTP1JMN3K3143I&v=20170305',
      success:function(data){
        var request= data.response.venue;
        if(request.hasOwnProperty('rating')!=''){
          marker.rating=request.rating;
        }
        else {
          marker.rating='';
        }
        if(request.hasOwnProperty('likes')!=''){
          marker.likes=request.likes.summary;
        }
        else {
          marker.likes='';

        }

      }
    })
  });
  //color change on click
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });
  marker.addListener('mouseover',function(){
    this.setIcon(highlightedIcon);
  });

  marker.addListener('mouseout',function(){
    this.setIcon(defaultIcon);
  });
}
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}
function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '<br>'+marker.rating+'<br>'+marker.likes+'</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }

this.Bounce=function(marker){
  marker.setAnimation(google.maps.Animation.BOUNCE);
  marker.setIcon(highlightedIcon);
  setTimeout(function() {
            marker.setAnimation(null);
            marker.setIcon(defaultIcon)
        }, 700);
  populateInfoWindow(marker,largeInfowindow);
};

this.searchtext=ko.observable('');
this.search=function(){
  largeInfowindow.close();
  var text=this.searchtext;
  if(text.length===0){
    this.showAll=true;
  }
  else {
    for(var i=0;i<markers.length;i++)
    {
      if(markers[i].title.toLowerCase().indexOf(text.toLowerCase())>-1){
        markers[i].show(true);
        markers[i].setVisible(true);
      }
      else {
        markers[i].show(false);
        markers[i].setVisible(false);
      }
    }
  }
  largeInfowindow.close();

};
this.showAll=function(marker){
  for(var i=0;i<markers.length;i++){
    markers[i].show(marker);
    marker[i].setVisible(marker);
  }
};
}
