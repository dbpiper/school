/*
 * Author: David Piper
 * Filename: main.rs
 * Description: 
 *  This file implements the main logic for the project.
 *  This includes prompting the user for information,
 *  reading the file, creating the student structs,
 *  storing the structs in a HashMap, and then
 *  doing queries and then retrieving all.
 */

use std::fs::File;
use std::io::prelude::*;
use std::io;
use std::iter::FromIterator;
use std::collections::HashMap;
use std::time::Duration;
use std::thread;

mod student;
use student::Student;

fn main() { 
    println!("Please enter the name of the file containing the grades.");

    let mut grades_filename = String::new();

    // read the input from the user, display error if not able to
    io::stdin().read_line(&mut grades_filename)
        .expect("Failed to read the filename");
    
    // remove newline/whitespace from the input
    grades_filename = grades_filename.trim().to_string();

    // attempt to open the file, display error if not able to
    let mut f = File::open(grades_filename).expect("file not found");

    let mut contents = String::new();
    // attempt to read the file to string, display error if not able to
    f.read_to_string(&mut contents)
        .expect("something went wrong reading the file");
   
    // collect the interator returned by contents.lines to a vector of Strings
    // (converting from &str, string slice)
    let lines: Vec<String> = Vec::from_iter(contents.lines().map(String::from));
    
    let mut students = HashMap::new();

    // use vector range slicing to skip the first element as it is not
    // a student an is instead the header for the data: "C# CLA OLA Quiz Exam FinalExam"
    for line in &lines[1..] {
        // split line on whitespace, converting &str (string splice) to String struct
        let line_vec: Vec<String> = Vec::from_iter(line.split_whitespace().map(String::from));

        // get the 0th element, must be done this way as 
        // indexing an element which is going out of scope is not allowed
        let id = line_vec.iter().nth(0).unwrap().clone();
        let cla_score = line_vec[1].parse::<u32>().unwrap();
        let ola_score = line_vec[2].parse::<u32>().unwrap();
        let quiz_score = line_vec[3].parse::<u32>().unwrap();
        let exam_score = line_vec[4].parse::<u32>().unwrap();
        let final_score = line_vec[5].parse::<u32>().unwrap();
            
        let temp_student = Student::new(id, cla_score, ola_score,
            quiz_score, exam_score, final_score); 

        // need to clone the id as it is moved to the map ownership
        students.insert(temp_student.get_id().clone(), temp_student);
    }

    // loop twice
    // as the project description said that we
    // need to do two queries for specific students
    // and then print all
    for _ in 1..3 {
        println!("Please enter the C# of the Student to get information for.");

        let mut id = String::new();

        // read the input from the user, display error if not able to
        io::stdin().read_line(&mut id)
            .expect("Failed to read the C#");
       
        // remove newline/whitespace from the input
        id = id.trim().to_string();

        // get returns an Option enum, since it may not find
        // the item requested
        match students.get(&id) {
            Some(ref student) => println!("The following is the information for the student \
                with C# {}: {:?}", id, student),
            None => println!("There was no student found with the given C# {}", id)
        }
    }

    // some nice formatting to let the user know that the queries are complete
    println!("\n");
    println!("The two queries are complete.\nNow printing information for all students.");
    println!("\n");

    // sleep for a bit so the user has some time to look over the queries before the terminal
    // is filled with text from all the students
    thread::sleep(Duration::from_millis(1000));
    
    for (id, student) in &students {
        println!("The following is the information for the student \
                with C# {}: {:?}", id, student);
    }
 
    find_print_max(&students);
    calculate_print_average(&students);
}

fn calculate_print_average(ref students: &HashMap<String, Student>) {
    // get the average 5-tuple
    // and access each element of it
    // corresponding to the respective fields
    let average_scores = calculate_average(&students);
    let average_cla = average_scores.0;
    let average_ola = average_scores.1;
    let average_quiz = average_scores.2;
    let average_exam = average_scores.3;
    let average_final = average_scores.4;

    println!("\n");
    println!("Now printing the averages of the scores.");
    println!("The average CLA score was: {}", average_cla);
    println!("The average OLA score was: {}", average_ola);
    println!("The average Quiz score was: {}", average_quiz);
    println!("The average Exam score was: {}", average_exam);
    println!("The average Final score was: {}", average_final); 
}

// search through the HashMap and
// add up the totals for each field
// then divide by the number of students
// returning all the results in a 5-tuple
fn calculate_average(ref students: &HashMap<String, Student>) -> (f64, f64, f64, f64, f64) {
    // use floats for these so we don't have to cast later on
    let mut num_students: f64 = 0.0;
    
    let mut sum_cla: f64 = 0.0;
    let mut sum_ola: f64 = 0.0;
    let mut sum_quiz: f64 = 0.0;
    let mut sum_exam: f64 = 0.0;
    let mut sum_final: f64 = 0.0;

    for (id, student) in students.iter() {
        // add the scores together, casting each u32 to f64
        sum_cla += student.get_cla_score() as f64;
        sum_ola += student.get_ola_score() as f64;
        sum_quiz += student.get_quiz_score() as f64;
        sum_exam += student.get_exam_score() as f64;
        sum_final += student.get_final_score() as f64;

        num_students += 1 as f64;
    }
    
    (sum_cla/num_students, sum_ola/num_students, sum_quiz/num_students,
     sum_exam/num_students, sum_final/num_students)
}

fn find_print_max(ref students: &HashMap<String, Student>) {
    // get the max 5-tuple
    // and access each element of it
    // corresponding to the respective fields
    let max_scores = find_max(&students);
    let max_cla = max_scores.0;
    let max_ola = max_scores.1;
    let max_quiz = max_scores.2;
    let max_exam = max_scores.3;
    let max_final = max_scores.4;

    println!("\n");
    println!("Now printing the max scores.");
    println!("The max CLA score was: {}", max_cla);
    println!("The max OLA score was: {}", max_ola);
    println!("The max Quiz score was: {}", max_quiz);
    println!("The max Exam score was: {}", max_exam);
    println!("The max Final score was: {}", max_final);
}


// search through the HashMap and
// find the max scores for each type of score
// returning all the results in a 5-tuple
fn find_max(ref students: &HashMap<String, Student>) -> (u32, u32, u32, u32, u32) {
    let mut max_cla = 0;
    let mut max_ola = 0;
    let mut max_quiz = 0;
    let mut max_exam = 0;
    let mut max_final = 0;

    for (id, student) in students.iter() {
        let cla_score = student.get_cla_score();
        let ola_score = student.get_ola_score();
        let quiz_score = student.get_quiz_score();
        let exam_score = student.get_exam_score();
        let final_score = student.get_final_score();

        if cla_score > max_cla {
            max_cla = cla_score;
        }
        if ola_score > max_ola {
            max_ola = ola_score;
        }
        if quiz_score > max_quiz {
            max_quiz = quiz_score;
        }
        if exam_score > max_exam {
            max_exam = exam_score;
        }
        if final_score > max_final {
            max_final = final_score;
        }     
    }
    
    (max_cla, max_ola, max_quiz, max_exam, max_final)
}
