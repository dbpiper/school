use std::fs::File;
use std::io::prelude::*;
use std::io;
use std::iter::FromIterator;
use std::collections::HashMap;

mod student;
use student::Student;

fn main() { 
    //println!("Please enter the name of the file containing the grades.");

    //let mut gradesFilename = String::new();

    //io::stdin().read_line(&mut gradesFilename)
        //.expect("Failed to read the filename");
    
    //gradesFilename = gradesFilename.trim().to_string();

    //println!("In file {}", gradesFilename);

    //let mut f = File::open(gradesFilename).expect("file not found");
    let mut f = File::open("scores.txt").expect("file not found");

    let mut contents = String::new();
    f.read_to_string(&mut contents)
        .expect("something went wrong reading the file");
    
    let lines: Vec<String> = Vec::from_iter(contents.lines().map(String::from));
    
    let mut students = HashMap::new();

    // use vector range slicing to skip the first element as it is not
    // a student an is instead the header for the data: "C# CLA OLA Quiz Exam FinalExam"
    for line in &lines[1..] {
        // split line on whitespace, converting &str (string splice) to String struct
        let line_vec: Vec<String> = Vec::from_iter(line.split_whitespace().map(String::from));

        let id = line_vec.iter().nth(0).unwrap().clone();
        let cla_score = line_vec[1].parse::<u32>().unwrap();
        let ola_score = line_vec[2].parse::<u32>().unwrap();
        let quiz_score = line_vec[3].parse::<u32>().unwrap();
        let exam_score = line_vec[4].parse::<u32>().unwrap();
        let final_score = line_vec[5].parse::<u32>().unwrap();
            
        let temp_student = Student::new(id, cla_score, ola_score,
            quiz_score, exam_score, final_score);

        // need to copy the id as temp student is being moved, and
        // the borrowed id does not live as long as students
        // as it goes out of scope at each iteration of the loop
        students.insert(temp_student.get_id().clone(), temp_student);
    }


}
