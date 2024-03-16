"use client";
import { getStudentSignedCourses } from "@/actions/student/courses";
import DashboardCard from "@/app/(dashboard)/_components/student/dashboard-card";
import { Course } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { CourseList } from "../_components/student/course-list";

const HomeStudent = () => {
  const [LoadingCourses, setLoadingCourses] = useState(false);
  const [allCourses, setallCourses] = useState<Course[]>([]);
  const [numCompletedCourses, setnumCompletedCourses] = useState(0);
  const [numNonCompletedCourses, setnumNonCompletedCourses] = useState(0);

  const updateAllCourses = async () => {
    try {
      setLoadingCourses(true);
      const data = await getStudentSignedCourses();
      setnumCompletedCourses(data?.completedCourses!);
      setnumNonCompletedCourses(data?.nonCompletedCourses!);
      setallCourses(data?.allcourses as []);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    updateAllCourses();
  }, []);

  return (
    <div className="flex flex-col gap-y-3 w-full">
      {/** progress/ completed cards */}
      <div className="flex gap-3 w-full max-w-5xl p-3 mx-auto mt-5 ">
        <DashboardCard
          variant="inprogress"
          numOfCourses={numNonCompletedCourses}
        />
        <DashboardCard variant="completed" numOfCourses={numCompletedCourses} />
      </div>

      {/** courses grid  */}
      {allCourses.length ? (
        <CourseList courses={allCourses!} />
      ) : (
        <div className="w-full p-3 flex items-center justify-center">
          <div className="text-lg text-slate-500">
            You are not enrolled in any course
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeStudent;
