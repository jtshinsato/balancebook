// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])

.factory('Items', ['$firebaseArray', function($firebaseArray) {
  var itemsRef = new Firebase ('https://balancebook.firebaseio.com/items');
  return $firebaseArray(itemsRef);
}])
 
.controller ('ListCtrl', function($scope, $ionicListDelegate, Items, $ionicModal, $filter, $firebaseObject){

  $scope.items = Items;
  var ref =  new Firebase("https://balancebook.firebaseio.com/data");
  var totalref = new $firebaseObject(ref);
  totalref.$loaded().then(function() {
    if(totalref.$value === null){
      ref.set({total : 0});
    } // "bar"
  });

  // synchronize the object with a three-way data binding
  // click on `index.html` above to see it used in the DOM!
  totalref.$bindTo($scope, "data");

  $scope.itemdate = new Date();
  $scope.desc = '';
  $scope.cost = '';
  $scope.filter=[];
  $scope.filter.sort='date';
  $scope.filter.reverse='true';
  $scope.filter.status='';

  $scope.addItem = function(desc, cost, date) {
    var format = 'yyyy/MM/dd';
    var formattedDate = $filter('date')(new Date(date),format);
    $scope.items.$add({
      'desc' : desc,
      'cost' : cost,
      'date' : formattedDate.toString(),
      'status':'visible'
    });
    $scope.data.total+=cost;
  };
  
  $scope.unselectAll = function(){
    var itemRef='';
    for ( var i =0; i<$scope.items.length;i++){
      itemRef =  new Firebase('https://balancebook.firebaseio.com/items/'+$scope.items[i].$id);
      itemRef.child('status').set('hidden');
    }
    $scope.data.total = 0;
  }

  $scope.selectAll = function(){
    var itemRef='';
    $scope.data.total = 0;
    for ( var i =0; i<$scope.items.length;i++){
      itemRef =  new Firebase('https://balancebook.firebaseio.com/items/'+$scope.items[i].$id);
      itemRef.child('status').set('visible');
      $scope.data.total+=$scope.items[i].cost;
    }
  }

  $scope.setSort = function(sortVal) {
    if ($scope.filter.sort === sortVal) {
      $scope.filter.reverse = !$scope.filter.reverse;
    }
    else {
      $scope.filter.sort = sortVal;
    }
    
  }

  $scope.toggleHidden = function(){
    if($scope.filter.status === ''){
      $scope.filter.status = '!hidden';  
    }
    else {
      $scope.filter.status = '';
    }
    
  }

  $scope.toggleItem = function(item) {
    var itemRef =  new Firebase('https://balancebook.firebaseio.com/items/'+item.$id);


    if (item.status === 'hidden'){
      itemRef.child('status').set('visible');
      $scope.data.total+=item.cost;
    }
    else {
      itemRef.child('status').set('hidden');
      $scope.data.total-=item.cost;
    }
    $ionicListDelegate.closeOptionButtons();

  };

    $ionicModal.fromTemplateUrl('pages/addCostModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
      $scope.modal.show();
    };
    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
      // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
      // Execute action
    });

}); 