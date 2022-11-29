const express = require('express');
const router = express.Router();

const Semester = require('../models/Semester');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const Exam = require('../models/Exam');

const {verifyAuthentication} = require('../passport/auth');

//Middlewear to grab semester data if user is permitted to view it
const loadSemester = (req, res, next) => {
    Semester.findOne({_id: req.params.semId, user: req.user.id})
        .then(semester => {
            if(semester){
                req.semester = semester;
                return next();
            }
            return res.redirect('/dashboard');
        }).catch(err => console.error(err));
}

//Middlewear to verify user owns classId they are using (prereq: middlewear loadSemester)
const verifyClass = (req, res, next) => {
    const {classId} = req.body;

    Class.findOne({_id: classId, semester: req.semester.id})
        .then(classObj => {

            if(classObj){
                return next();
            }
            return res.redirect(`/dashboard/${req.semester.id}`);

        }).catch(err => console.error(err));
}

//Middlewear to grab class data if user is permitted to view it (prereq: middlewear loadSemester)
const loadClass = (req, res, next) => {
    Class.findOne({_id: req.params.classId, semester: req.semester.id})
        .then(classObj => {
            if(classObj){
                req.class = classObj;
                return next();
            }
            return res.redirect(`/dashboard/${req.semester.id}/editClasses`);
        }).catch(err => console.error(err));
}

//Middlewear to grab assignment data if user is permitted to view it (prereq: middlewear loadSemester)
const loadAssignment = (req, res, next) => {
    Assignment.findById(req.params.assignId)
        .then(assignment => {

            if(assignment){
                Class.findById(assignment.class)
                    .then(classObj => {

                        if(classObj.semester == req.semester.id){
                            req.assignment = assignment;
                            return next();
                        }
                        return res.redirect(`/dashboard/${req.semester.id}`);

                    }).catch(err => console.error(err));
            }
            else{
                return res.redirect(`/dashboard/${req.semester.id}`);
            }
        
        }).catch(err => console.error(err));
}

//Middlewear to grab exam data if user is permitted to view it (prereq: middlewear loadSemester)
const loadExam = (req, res, next) => {
    Exam.findById(req.params.examId)
        .then(exam => {

            if(exam){
                Class.findById(exam.class)
                    .then(classObj => {

                        if(classObj.semester == req.semester.id){
                            req.exam = exam;
                            return next();
                        }
                        return res.redirect(`/dashboard/${req.semester.id}`);

                    }).catch(err => console.error(err));
            }
            else{
                return res.redirect(`/dashboard/${req.semester.id}`);
            }
    
    }).catch(err => console.error(err));
}

router.get('/', verifyAuthentication, (req, res) => {
    Semester.find({user: req.user})
        .then(semesters => {
            res.render('temp/semesterSelect',{
                user: req.user,
                semesters
            });
        }).catch(err => console.error(err));
});

router.get('/new', verifyAuthentication, (req, res) => {
    res.render('temp/newSemester',{
        user: req.user
    });
});

router.post('/new', verifyAuthentication, (req, res) => {
    const {name} = req.body;

    const newSemester = new Semester({
        name,
        user: req.user.id
    });

    newSemester.save()
        .then((newSemesterSaved) => {
            return res.redirect(`/dashboard/${newSemesterSaved.id}/editClasses`);
        })
});

router.get('/:semId', verifyAuthentication, loadSemester, (req, res) => {
    Class.find({
        semester: req.semester.id
    }).then(classes => {

        let classIds = [];
        classes.forEach((classObj => {
            classIds.push(classObj.id);
        }));

        Assignment.find({
            class:  {$in: classIds},
            progress: {$lt: 100}
        }).then(assignments => {
    
                Exam.find({
                    class: {$in: classIds},
                    datetime: {$gt: Date.now()}
                }).then(exams => {
    
                    res.render('temp/dashboard', {
                        user: req.user,
                        semester: req.semester,
                        classes,
                        assignments,
                        exams
                    });
            
                    }).catch(err => console.log(err));
    
            }).catch(err => console.log(err));

    }).catch(err => console.error(err));
});

router.post('/:semId', verifyAuthentication, loadSemester, (req, res) => {
    const {name} = req.body;

    Semester.findByIdAndUpdate(req.semester.id, {name})
        .then(() => {

            res.redirect(`/dashboard`);

        }).catch(err => console.error(err));
});

router.get('/:semId/delete', verifyAuthentication, loadSemester, (req, res) => {
    Semester.findByIdAndDelete(req.semester.id)
        .then(() => {

            Class.find({semester: req.semester.id})
                .then(classes => {

                    let classIds = [];
                    classes.forEach((classObj => {
                        classIds.push(classObj.id);
                    }));

                    Class.deleteMany({semester: req.semester.id})
                        .then(() => {

                            Assignment.deleteMany({class: {$in: classIds}})
                                .then(() => {

                                    Exam.deleteMany({class: {$in: classIds}})
                                        .then(() => {

                                            res.redirect('/dashboard');

                                        }).catch(err => console.error(err));

                                }).catch(err => console.error(err));

                        }).catch(err => console.error(err));
                    

                }).catch(err => console.error(err));
        
            }).catch(err => console.log(err));
});

router.get('/:semId/editClasses', verifyAuthentication, loadSemester, (req, res) => {
    Class.find({semester: req.semester.id})
        .then(classes => {
            res.render('temp/editClasses', {
                user: req.user,
                semester: req.semester,
                classes
            });
        }).catch(err => console.error(err));
});

router.post('/:semId/editClasses/new', verifyAuthentication, loadSemester, (req, res) => {
    const {name, prof, location, color} = req.body;

    const errors = [];

    const colorRegex = /^#[0-9A-Fa-f]{6}$/;

    if(!colorRegex.test(color)) errors.push('Color is not in correct format');

    if(errors.length > 0){
        return res.redirect(`/dashboard/${req.semester.id}/editClasses`);
    }

    const newClass = new Class({
        name,
        prof,
        location,
        color,
        semester: req.semester.id
    });

    newClass.save()
        .then(() => {

            res.redirect(`/dashboard/${req.semester.id}/editClasses`);

        }).catch(err => console.error(err));
});

router.post('/:semId/editClasses/:classId', verifyAuthentication, loadSemester, loadClass, (req, res) => {
    const {name, prof, location, color} = req.body;

    const errors = [];

    const colorRegex = /^#[0-9A-Fa-f]{6}$/;

    if(!colorRegex.test(color)) errors.push('Color is not in correct format');

    if(errors.length > 0){
        return res.redirect(`/dashboard/${req.semester.id}/editClasses`);
    }

    Class.findByIdAndUpdate(req.class.id, {name, prof, location, color})
        .then(() => {

            res.redirect(`/dashboard/${req.semester.id}/editClasses`);

        }).catch(err => console.error(err));
});

router.get('/:semId/editClasses/:classId/delete', verifyAuthentication, loadSemester, loadClass, (req, res) => {
    Class.findByIdAndDelete(req.class.id)
        .then(() => {

            Assignment.deleteMany({class: req.class.id})
                .then(() => {

                    Exam.deleteMany({class: req.class.id})
                        .then(() => {

                            res.redirect(`/dashboard/${req.semester.id}/editClasses`);

                        }).catch(err => console.error(err));

                }).catch(err => console.error(err));

        }).catch(err => console.error(err));
});

router.get('/:semId/new', verifyAuthentication, loadSemester, (req, res) => {
    Class.find({semester: req.semester.id})
        .then(classes => {
            res.render('temp/newAssignmentExam', {
                user: req.user,
                semester: req.semester,
                classes
            });
        }).catch(err => console.error(err));
});

router.post('/:semId/new/assignment', verifyAuthentication, loadSemester, verifyClass, (req, res) => {
    const {name, desc, estimatedDays, due, classId} = req.body;

    const errors = [];

    const parsedEstimatedDays = parseInt(estimatedDays);
    const parsedDue = Date.parse(due);

    if(isNaN(parsedEstimatedDays)) errors.push('Estimated Days to Complete must be a number');
    if(isNaN(parsedDue)) errors.push('Due Date must be a valid date');

    if(errors.length > 0){
        return res.redirect(`/dashboard/${req.semester.id}/new`);
    }

    const newAssignment = new Assignment({
        name,
        desc,
        estimatedDays: parsedEstimatedDays,
        due: parsedDue,
        class: classId
    });

    newAssignment.save()
        .then(() => {
            res.redirect(`/dashboard/${req.semester.id}`);
        }).catch(err => console.error(err));
});

router.post('/:semId/assignment/:assignId', verifyAuthentication, loadSemester, verifyClass, loadAssignment, (req, res) => {
    const {name, desc, estimatedDays, due, classId, progress} = req.body;

    let errors = [];

    const parsedEstimatedDays = parseInt(estimatedDays);
    const parsedDue = Date.parse(due);
    const parsedProgress = parseInt(progress);

    if(isNaN(parsedEstimatedDays)) errors.push('Estimated Days to Complete must be a number');
    if(isNaN(parsedDue)) errors.push('Due Date must be a valid date');
    if(isNaN(parsedProgress)) errors.push('Progress must be a number');
    if(parsedProgress > 100 || parsedProgress < 0) errors.push('Progress must be 0-100');

    if(errors.length > 0){
        return res.redirect(`/dashboard/${req.semester.id}`);
    }

    Assignment.findByIdAndUpdate(req.assignment.id, {name, desc, estimatedDays: parsedEstimatedDays, due: parsedDue, progress: parsedProgress, class: classId})
        .then(() => {

            res.redirect(`/dashboard/${req.semester.id}`);

        }).catch(err => console.error(err));
});

router.get('/:semId/assignment/:assignId/delete', verifyAuthentication, loadSemester, loadAssignment, (req, res) => {
    Assignment.findByIdAndDelete(req.assignment.id)
        .then(() => {

            res.redirect(`/dashboard/${req.semester.id}`);

        }).catch(err => console.error(err));
});

router.post('/:semId/new/exam', verifyAuthentication, loadSemester, verifyClass, (req, res) => {
    const {name, desc, datetime, classId} = req.body;

    const errors = [];

    const parsedDatetime = Date.parse(datetime);

    if(isNaN(parsedDatetime)) errors.push('Exam date must be a valid date');

    if(errors.length > 0){
        return res.redirect(`/dashboard/${req.semester.id}/new`);
    }

    const newExam = new Exam({
        name,
        desc,
        datetime: parsedDatetime,
        class: classId
    });

    newExam.save()
        .then(() => {
            res.redirect(`/dashboard/${req.semester.id}`);
        }).catch(err => console.error(err));
});

router.post('/:semId/exam/:examId', verifyAuthentication, loadSemester, verifyClass, loadExam, (req, res) => {
    const {name, desc, datetime, classId} = req.body;

    const errors = [];

    const parsedDatetime = Date.parse(datetime);

    if(isNaN(parsedDatetime)) errors.push('Exam date must be a valid date');

    if(errors.length > 0){
        return res.redirect(`/dashboard/${req.semester.id}`);
    }

    Exam.findByIdAndUpdate(req.exam.id, {name, desc, datetime: parsedDatetime, class: classId})
        .then(() => {

            res.redirect(`/dashboard/${req.semester.id}`);

        }).catch(err => console.error(err));
});

router.get('/:semId/exam/:examId/delete', verifyAuthentication, loadSemester, loadExam, (req, res) => {
    Exam.findByIdAndDelete(req.exam.id)
        .then(() => {

            res.redirect(`/dashboard/${req.semester.id}`);

        }).catch(err => console.error(err));
});

module.exports = router;