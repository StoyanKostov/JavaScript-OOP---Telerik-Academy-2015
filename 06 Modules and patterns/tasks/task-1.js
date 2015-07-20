/* Task Description */
/* 
* Create a module for a Telerik Academy course
  * The course has a title and presentations
    * Each presentation also has a title
    * There is a homework for each presentation
  * There is a set of students listed for the course
    * Each student has firstname, lastname and an ID
      * IDs must be unique integer numbers which are at least 1
  * Each student can submit a homework for each presentation in the course
  * Create method init
    * Accepts a string - course title
    * Accepts an array of strings - presentation titles
    * Throws if there is an invalid title
      * Titles do not start or end with spaces
      * Titles do not have consecutive spaces
      * Titles have at least one character
    * Throws if there are no presentations
  * Create method addStudent which lists a student for the course
    * Accepts a string in the format 'Firstname Lastname'
    * Throws if any of the names are not valid
      * Names start with an upper case letter
      * All other symbols in the name (if any) are lowercase letters
    * Generates a unique student ID and returns it
  * Create method getAllStudents that returns an array of students in the format:
    * {firstname: 'string', lastname: 'string', id: StudentID}
  * Create method submitHomework
    * Accepts studentID and homeworkID
      * homeworkID 1 is for the first presentation
      * homeworkID 2 is for the second one
      * ...
    * Throws if any of the IDs are invalid
  * Create method pushExamResults
    * Accepts an array of items in the format {StudentID: ..., Score: ...}
      * StudentIDs which are not listed get 0 points
    * Throw if there is an invalid StudentID
    * Throw if same StudentID is given more than once ( he tried to cheat (: )
    * Throw if Score is not a number
  * Create method getTopStudents which returns an array of the top 10 performing students
    * Array must be sorted from best to worst
    * If there are less than 10, return them all
    * The final score that is used to calculate the top performing students is done as follows:
      * 75% of the exam result
      * 25% the submitted homework (count of submitted homeworks / count of all homeworks) for the course
      */

function solve() {
  var Course = (function(){
    var Course = {
      init: function(title, presentations) {
        this.title = title;
        this.presentations = presentations;
        this.students = [];
        this.homeworks = [];
        this.scores = [];
        this.studentsFinalScore = [];

        return this;
      },
      addStudent: function(name) {
        var student = validateName(name);

        student.id = this.students.length + 1;
        this.students.push(student);

        return student.id;
      },
      getAllStudents: function() {
        return this.students.slice();
      },
      submitHomework: function(studentID, homeworkID) {
        validateStudentID(studentID, this.students);
        validateHomeWorkID(homeworkID, this.presentations);

        this.homeworks.push({
          'studentID': studentID,
          'homeworkID': homeworkID
        });

        return this;
      },
      pushExamResults: function(results) {
        this.scores = validateResults(results, this.students);
        return this;
      },
      getTopStudents: function() {
        //Set scores
        for (var i = this.students.length - 1; i >= 0; i--) {
          var score = calculateStudentFinalScore(this.students[i].id, this.scores, this.homeworks);
          this.studentsFinalScore.push({
            'studentID': this.students[i].id,
            'score': score
          });
        }

        return this.studentsFinalScore.sort(function (a, b) {
          if (a.score > b.score) {
            return 1;
          }
          if (a.score < b.score) {
            return -1;
          }
          return 0;
        }).slice(0, 10);
      }
    };

    Object.defineProperties(Course, {
      "title": {
        get: function () {
          return this._title;
        },
        set: function(title){
          validateTitle(title);
          this._title = title;
        }
      },
      "presentations": {
        get: function () {
          return this._presentations;
        },
        set: function(presentations){
          validatePresentations(presentations);
          this._presentations = presentations;
        }
      }
    });

    // Helper functions
    function calculateStudentFinalScore(studentID, scores, homeworks){
      var examAddend,
      homeworkAddend,
      submittedHomeworksbyId,
      courseHomeworksNumber = homeworks.length,
      filteredStudent = scores.filter(function(score){
        return score.StudentID === studentID;
      })[0];

      if (typeof filteredStudent.score === 'undefined') {
        filteredStudent.score = 0;
      }
      console.log('filteredStudent.score', filteredStudent.score);
      if (homeworks.length === 0) {
        examAddend = filteredStudent.score*1;
        homeworkAddend = 0;
      } else {
        examAddend = filteredStudent.score * 100 / 75;

        submittedHomeworksbyId = homeworks.filter(function(homework){
          return homework.studentID === studentID;
        });
        homeworkAddend = (submittedHomeworksbyId.length / homeworks.length) * 100 / 25;
      }
     
      return examAddend + homeworkAddend;
    }

    function validateTitle(title){
      if ((/(^\s|\s$)/).test(title)) {
        throw new Error('Titles do not start or end with spaces!');
      }

      if (title.length <= 1) {
        throw new Error('Titles have at least one character');
      }

      if ((/(\s{2,})/g).test(title)) {
        throw new Error('Titles do not have consecutive spaces');
      }
    }

    function validatePresentations(presentations){
      if (!Array.isArray(presentations)) {
        throw new Error('Presentations must be of type array');
      }

      if (presentations.length === 0) {
        throw new Error('No presentations');
      }

      presentations.forEach(function(presentation){
        validateTitle(presentation);
      });
    }

    function validateName(name){
      if(typeof name === 'undefined' || typeof name !== 'string'){
        throw new Error ('Invalid type for name.');
      }

      if(name.length === 0){
        throw new Error ('Empty names');
      }

      var names = name.split(' ');

      if(names.length !== 2){
        throw new Error ('Invalid names');
      }

      if (!/^[A-Z][a-z]*$/.test(names[0])) {
        throw new Error('Invalid first name');
      }

      if (!/^[A-Z][a-z]*$/.test(names[1])) {
        throw new Error('Invalid last name');
      }

      return {
        firstname: names[0],
        lastname: names[1]
      };
    }

    function validateStudentID(id, students){
      var student = students.filter(function(element){
        return element.id === id;
      });

      if(student.length === 0){
        throw new Error('No such student Id');
      }
    }

    function validateHomeWorkID(id, presentations){
      if(typeof presentations[id - 1] === 'undefined'){
        throw new Error('No such homework Id');
      }
    }

    function validateResults(results, students){
      var studentIDs = [];

      results.forEach(function(result){
        if (studentIDs.indexOf(result.StudentID) !== -1) {
          throw new Error('StudentID is given more than once');
        }
        studentIDs.push(result.StudentID);

        validateStudentID(result.StudentID, students);

        if (isNaN(Number(result.score))) {
          throw new Error('Score is not a number');
        }
      });

      return results;
    }

    return Course;
})();

return Course;
}


module.exports = solve;
