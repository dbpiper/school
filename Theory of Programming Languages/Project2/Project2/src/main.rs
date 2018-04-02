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

mod student;
use student::Student;

fn main() { 
    println!("Please enter the name of the file containing the grades.");

    let mut gradesFilename = String::new();

    // read the input from the user, display error if not able to
    io::stdin().read_line(&mut gradesFilename)
        .expect("Failed to read the filename");
    
    // remove newline/whitespace from the input
    gradesFilename = gradesFilename.trim().to_string();

    // attempt to open the file, display error if not able to
    let mut f = File::open(gradesFilename).expect("file not found");

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
        // and we must clone it, something similar is done by the unwrap
        // on the others
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

    println!("\n\n");
    println!("The two queries are complete.\nNow printing information for all students.");
    println!("\n\n");

    for (id, student) in &students {
        println!("The following is the information for the student \
                with C# {}: {:?}", id, student);
    }

}
