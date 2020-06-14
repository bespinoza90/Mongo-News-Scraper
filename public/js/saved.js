$(document).ready(function () {

  $.getJSON("/savedArticles", function (data) {
    if (data.length > 0) { 
      $("#no-saved-articles").css("display", "none"); 

      for (var i = 0; i < data.length; i++) {
        var div1 = $("<div>").addClass("row article");
        var div2 = $("<div>").addClass("col s12");
        var div3 = $("<div>").addClass("card teal");
        var div31 = $("<div>").addClass("card-content white-text");
        var articleLink = $("<a>").attr("href", data[i].link);
        var span = $("<span>").addClass("card-title white-text").text(data[i].title);
        articleLink.append(span);
        var p = $("<p>").text(data[i].summary);
        div31.append(articleLink, p);
        var div32 = $("<div>").addClass("card-action");
        var deleteSavedArticleBtn = $("<a>").addClass("delete-saved-btn red waves-effect waves-light btn").attr("data-articleid", data[i]._id).text("Delete From Saved");
        var notesBtn = $("<a>").addClass("notes-btn red waves-effect waves-light btn").attr("data-articleid", data[i]._id).text("Article Notes");
        div32.append(deleteSavedArticleBtn, notesBtn);
        div3.append(div31, div32);
        div2.append(div3);
        div1.append(div2);
        $("#saved-articles").append(div1);
      }
    } else { 
      $("#no-saved-articles").css("display", "block");
    }
  });

  $("#clear-saved-btn").click(function () {
    $.ajax({
      url: "/savedArticles",
      type: "DELETE",
      success: function (data) {
        location.reload();
      }
    });
  });

  $(document).on("click", ".delete-saved-btn", function () {
    var articleID = $(this).attr("data-articleid");

    $.ajax({
      url: "/savedArticles/" + articleID,
      type: "DELETE",
      success: function (data) {
        location.reload();
      }
    });
  });

  $(document).on("click", ".notes-btn", function () {
    var articleID = $(this).attr("data-articleid");

    $.getJSON("/savedArticles/" + articleID, function (data) { 

      
      var div1 = $("<div>").addClass("modal modal-fixed-footer").attr("id", "modal" + articleID);
      var div2 = $("<div>").addClass("modal-content");

      if (data.notes.length > 0) { 
        for (var i = 0; i < data.notes.length; i++) { 
          var divA = $("<div>").addClass("note-card card-panel teal");
          var span = $("<span>").attr("contenteditable", true).attr("data-noteid", data.notes[i]._id).addClass("white-text note-text-span").text(data.notes[i].body);
          var deleteNoteBtn = $("<a>").addClass("btn-floating red btn btn-small waves-effect waves-light remove-note-button").attr("data-noteid", data.notes[i]._id);
          var deleteIcon = $("<i>").addClass("material-icons").text("delete");
          deleteNoteBtn.append(deleteIcon);
          divA.append(span, deleteNoteBtn);
          div2.append(divA);
        }
      } else { 
        var divA = $("<div>").addClass("note-card card-panel teal");
        var span = $("<span>").addClass("white-text").text("No notes for this article yet.");
        divA.append(span);
        div2.append(divA);
      }

      var h5 = $("<h5>").text("Add a note:");
      var form = $("<form>");
      var div21 = $("<div>").addClass("input-field col l6 s12");
      var textArea = $("<textarea>").addClass("materialize-textarea note-body").attr("id", "add-note-for" + articleID);
      var addNoteBtn = $("<button>").addClass("add-note-btn btn waves-effect waves-light").attr("data-articleid", articleID).attr("type", "submit").text("Add");
      var div3 = $("<div>").addClass("modal-footer");
      var closeModalBtn = $("<a>").addClass("modal-action green modal-close waves-effect waves-green btn-flat").text("Close")
      div3.append(closeModalBtn);
      div21.append(textArea);
      form.append(div21, addNoteBtn);
      div2.append($("<br>"), h5, form);
      div1.append(div2, div3);
      $("#notes-modals").append(div1);

      $('#modal' + articleID).modal().modal('open');
    });
  });

  $(document).on("click", ".add-note-btn", function (event) {
    event.preventDefault();
    var articleID = $(this).attr("data-articleid");

    $.ajax({
      method: "POST",
      url: "/savedArticles/" + articleID,
      data: {
        body: $("#add-note-for" + articleID).val().trim()
      }
    }).then(function (data) {
      location.reload();
    });
  });

  $(document).on("input", ".note-text-span", function () {
    var noteID = $(this).attr("data-noteid");
    var newNote = $(this).text();

    $.ajax({
      url: '/notes/' + noteID,
      method: 'PUT',
      data: { note: newNote }
    }).then(function (data) {
      console.log(data);
    });
  });

  $(document).on("click", ".remove-note-button", function () {
    var noteID = $(this).attr("data-noteid");

    $.ajax({
      url: "/notes/" + noteID,
      type: "DELETE",
      success: function (data) {
        location.reload();
      }
    });
  });

});