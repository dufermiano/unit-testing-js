'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon')

chai.should();

describe('sinon tests', () => {
    let student, schedule;

    beforeEach(()=>{
        student = {
            dropClass: function(classId, cb) {
                
                if(!!cb.dropClass){
                    cb.dropClass();
                } else{
                    cb();
                }
            }, 
            addClass: function(schedule) {
                if(!schedule.classIsFull()){
                    // something
                    return true;
                } else {
                    return false;
                }
            }
        };

        schedule = {
            dropClass: function() {
                console.log("class dropped");
            },
            classIsFull: function() {
                return true
            }
        }
    });

    describe('student.dropClass', () => {
        it('should call the callback', () => {
            var spy = sinon.spy();

            student.dropClass(1, spy);
            spy.called.should.be.true;
        });
    });

    it('should call the callback and log to the console', () => {
        function onClassDropped() {
            console.log("Called the function");
        }

        let spy = sinon.spy(onClassDropped);

        student.dropClass(1, spy);
        spy.called.should.be.true;
    });

    it('should call the callback even if it`s a method or an object', () => {

        sinon.spy(schedule, 'dropClass');
        student.dropClass(1, schedule);
        schedule.dropClass.called.should.be.true;


    });

    describe('student with stubs', function(){
        it('should call a stubbed method', function(){
            let stub = sinon.stub(schedule);
            student.dropClass(1, stub);
            stub.dropClass.called.should.be.true;
        });

        it('should return true when the class is not full', function(){
            var stub = sinon.stub(schedule);
            stub.classIsFull.returns(false);

            let returnVal = student.addClass(schedule);
            returnVal.should.be.true;
        });
    });

    describe('student with mocks', function(){
        it('mocks schedule', function(){
            let mockObj = sinon.mock(schedule);
            let expec = mockObj.expects('classIsFull').once();

            student.addClass(schedule);
            expec.verify();
        });
    });
});

