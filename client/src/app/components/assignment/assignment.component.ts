import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assignment',
  templateUrl: './assignment.component.html',
  styleUrls: ['./assignment.component.css']
})
export class AssignmentComponent implements OnInit {

  icons: string[] = [
    'assignment', 
    'book', 
    'science', 
    'calculate'];
  assignmentName: string[] = [
    'Challenging Problem Homework #6', 
    'CriminalIntent Application Chapters 9-13', 
    'Homework#7 Problems 13-26 Odd', 
    'Argumentative Essay'];
  assignmentDescription: string[] = [
    'Complete the homework posted on Black Board', 
    'Submit the assignment as soon as possible', 
    'This assignment will prepare you for final',
    'Do not wait to start this assignment'];
  assignmentDueDate: string[] = [
    '10/29/2020', 
    '11/7/2020', 
    '12/13/2020', 
    '11/13/2020'];
  assignmentGradeOptions: boolean[] = [true, false];

  selectedIcon: string;
  selectedAssignmentName: string;
  selectedAssignmentDesc: string;
  selectedAssignmentDueDate: string;
  selectedGradingOption: boolean;

  forgotCount: number;
  rememberedCount: number;
  assignmentPostedDate: string;

  constructor() { }

  ngOnInit(): void {
    this.selectedIcon = this.icons[Math.floor(Math.random() * this.icons.length)];
    this.selectedAssignmentName = this.assignmentName[Math.floor(Math.random() * this.assignmentName.length)];
    this.selectedAssignmentDesc = this.assignmentDescription[Math.floor(Math.random() * this.assignmentDescription.length)];
    this.selectedAssignmentDueDate = this.assignmentDueDate[Math.floor(Math.random() * this.assignmentDueDate.length)];
    this.selectedGradingOption = this.assignmentGradeOptions[Math.floor(Math.random() * this.assignmentGradeOptions.length)];
    this.forgotCount = Math.floor(Math.random() * 100);
    this.rememberedCount = Math.floor(Math.random() * 100);
    this.assignmentPostedDate = this.selectedAssignmentDueDate;
  }

}
