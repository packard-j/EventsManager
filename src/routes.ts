import * as controller from "./controller";


export const AppRoutes = [
    // Volunteers
    {
        path: "/v",
        method: "post",
        action: controller.getVolunteers
    },
    {
        path: "/v/new",
        method: "post",
        action: controller.createVolunteer
    },
    {
        path: "/v/:id",
        method: "get",
        action: controller.getVolunteer
    },
    {
        path: "/v/:id/edit",
        method: "post",
        action: controller.editVolunteer
    },
    {
        path: "/v/:id/delete",
        method: "post",
        action: controller.deleteVolunteer
    },
    {
        path: "/v/add-event",
        method: "post",
        action: controller.addVolunteersToEvent
    },
    // Chocolate Bar Orders
    {
        path: "/cbo",
        method: "post",
        action: controller.getCbOrders
    },
    {
        path: "/cbo/new",
        method: "post",
        action: controller.createCbOrder
    },
    {
        path: "/cbo/:id",
        method: "get",
        action: controller.getCbOrder
    },
    {
        path: "/cbo/:id/edit",
        method: "post",
        action: controller.editCbOrder
    },
    {
        path: "/cbo/:id/delete",
        method: "post",
        action: controller.deleteCbOrder
    },
    // Locations
    {
        path: "/l",
        method: "post",
        action: controller.getLocations
    },
    {
        path: "/l/new",
        method: "post",
        action: controller.createLocation
    },
    {
        path: "/l/:id",
        method: "get",
        action: controller.getLocation
    },
    {
        path: "/l/:id/edit",
        method: "post",
        action: controller.editLocation
    },
    {
        path: "/l/:id/delete",
        method: "post",
        action: controller.deleteLocation
    },
    {
        path: "/l/add-event",
        method: "post",
        action: controller.addLocationsToEvent
    },
    // Assignments
    {
        path: "/a",
        method: "post",
        action: controller.getAssignments
    },
    {
        path: "/a/new",
        method: "post",
        action: controller.createAssignment
    },
    {
        path: "/a/:id",
        method: "get",
        action: controller.getAssignment
    },
    {
        path: "/a/:id/edit",
        method: "post",
        action: controller.editAssignment
    },
    {
        path: "/a/:id/delete",
        method: "post",
        action: controller.deleteAssignment
    },
    // Events
    {
        path: "/e",
        method: "post",
        action: controller.getEvents
    },
    {
        path: "/e/new",
        method: "post",
        action: controller.createEvent
    },
    {
        path: "/e/:id",
        method: "get",
        action: controller.getEvent
    },
    {
        path: "/e/:id/edit",
        method: "post",
        action: controller.editEvent
    },
    {
        path: "/e/:id/delete",
        method: "post",
        action: controller.deleteEvent
    }
];