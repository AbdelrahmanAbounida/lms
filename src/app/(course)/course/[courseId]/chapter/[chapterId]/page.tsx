import React from "react";

const StudentCoursChapterView = ({
  params,
}: {
  params: { chapterId: string };
}) => {
  return <div>{params.chapterId}</div>;
};

export default StudentCoursChapterView;
