export const rolePermissions = {
  superAdmin: ["all"],
  admin: ["students", "faculty", "events", "notices", "gallery", "dashboard"],
  faculty: ["ownProfile", "viewStudents", "viewEvents"],
  student: ["ownProfile", "viewPublic"]
};
