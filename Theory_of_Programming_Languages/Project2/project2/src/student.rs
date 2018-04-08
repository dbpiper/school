/*
 * Author: David Piper
 * Filename: student.rs
 * Description:
 *  The purpose of this file is to act as a module
 *  containing the definition and implementation
 *  of the Student struct, which is the closest
 *  thing that Rust has to Classes per the
 *  requirement stated in the project description.
 *
 *  This struct has all the required member data
 *  and methods, including a constructor.
 */

// The struct is public/accessible, however its member data is not
#[derive(Debug)] // make it easy to print the struct
pub struct Student {
    id: String,
    cla_score: u32,
    ola_score: u32,
    quiz_score: u32,
    exam_score: u32,
    final_score: u32,
    total_points: u32,
    letter_grade: String // the description for the project was unclear
        // about wheter or not the letter_grade should be stored
        // or simply found on the fly through the function
        // it does state that a function should be provided
        // to find the letter grade, but it also states
        // that the Student "class" must contain a letter_grade.
        // So I have done both, there is a letter grade data member
        // and it has a getter.
}

impl Student {

    // Static methods

    // private method to add up the scores, to find total points
    // note that the final line in a function is the return type
    // and that functions can return early by using the "return" keyword
    // if the desired result is for a value to be returned using the standard
    // method of being the last line in the function then this value must
    // be an expression not a statement, hence the line is NOT ended with a semicolon
    // as this would be a statement not an expression
    fn calculate_total_points(cla_score: u32, ola_score: u32,
               quiz_score: u32, exam_score: u32, final_score: u32) -> u32 {
        cla_score + ola_score + quiz_score + exam_score + final_score 
    }

    // using conditions in match statement
    // done by using if statements inside of the match
    // see: https://stackoverflow.com/questions/47852269/can-i-use-and-in-match
    fn find_letter_grade(total_points: u32) -> String {
        match total_points {
            total if total >= 90 => "A".to_string(),
            total if total >= 87 && total < 90 => "B+".to_string(),
            total if total >= 83 && total < 87 => "B".to_string(),
            total if total >= 80 && total < 83 => "B-".to_string(),
            total if total >= 77 && total < 80 => "C+".to_string(),
            total if total >= 73 && total < 77 => "C".to_string(),
            total if total >= 70 && total < 73 => "C-".to_string(),
            total if total >= 67 && total < 70 => "D+".to_string(),
            total if total >= 63 && total < 67 => "D".to_string(),
            total if total >= 60 && total < 63 => "D-".to_string(),
            _ => "F".to_string(),
        }
    }

    pub fn new(id: String, cla_score: u32, ola_score: u32,
               quiz_score: u32, exam_score: u32, final_score: u32) -> Student {

        let total_points = Student::calculate_total_points(cla_score, ola_score,
            quiz_score, exam_score, final_score);
        let letter_grade = Student::find_letter_grade (total_points);
        Student {
            id: id,
            cla_score: cla_score,
            ola_score: ola_score,
            quiz_score: quiz_score,
            exam_score: exam_score,
            final_score: final_score,
            total_points: total_points,
            letter_grade: letter_grade
        }
    }

    // Instance methods
    
    // getter methods 

    // we need to be able to access the id to be able to store the Student
    // structs in a HashMap
    pub fn get_id(&self) -> &String {
        &self.id
    }

    // the project description said that we needed to provide a function
    // to "calculate" the letter grade. since this is done in the
    // constructor and we simply store a value (see above, it was
    // unclear if we were supposed to do this or not as it says that letter grade
    // is one of the required data members), this function is provided
    // instead to allow access to the letter grade.
    pub fn get_letter_grade(&self) -> &String {
       &self.letter_grade 
    }

    // we need these accessors to be able to find the average/max scores of each

    pub fn get_cla_score(&self) -> u32 {
        self.cla_score
    }

    pub fn get_ola_score(&self) -> u32 {
        self.ola_score 
    }

    pub fn get_quiz_score(&self) -> u32 {
        self.quiz_score    
    }

    pub fn get_exam_score(&self) -> u32 {
        self.exam_score    
    }

    pub fn get_final_score(&self) -> u32 {
        self.final_score
    }
}
