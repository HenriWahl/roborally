Template.chat.helpers({
  inGame: function () {
    return Players.findOne({gameId: this.gameId, userId: Meteor.userId(), robotId: {$ne: null}});
  },

  timeToStr: function (time) {
    return moment(new Date(time)).format("L LT");
  }

});

Template.chat.events({
  'submit form': function (event) {
    event.preventDefault();
    var message = {
      gameId: $(event.target).find('[name=gameId]').val(),
      message: $(event.target).find('[name=message]').val()
    };

    if (message.message.length > 0) {
      Meteor.call('addMessage', message, function (error) {
        if (error) {
          return alert(error.reason);
        }

        $(event.target).find('[name=message]').val('');
      });
    }
  },
  'click .cancel': function () {
    var game = Games.findOne(this.gameId);
    if (game.gamePhase !== GameState.PHASE.ENDED) {
      if (confirm("If you leave, you will forfeit the game, are you sure you want to give up?")) {
        const result = Meteor.call('leaveGame', game._id);
        if(typeof result !== "undefined"){
          alert(result);
        }
        Router.go('gamelist.page');
      }
    } else {
      Router.go('gamelist.page');
    }
  },
});

Template.chat.rendered = function () {
  Chat.find().observe({
    added: function () {
      var $chat = $('.chat'),
          $printer = $('.messages', $chat),
          printerH = $printer.innerHeight();
      if ($printer && $printer[0]) {
        $printer.stop().animate({scrollTop: $printer[0].scrollHeight - printerH}, 100);
      }
    }
  });
};
