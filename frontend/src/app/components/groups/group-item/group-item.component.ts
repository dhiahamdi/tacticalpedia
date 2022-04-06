import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: "app-group-item",
    templateUrl: "./group-item.component.html",
    styleUrls: ["./group-item.component.scss"],
})
export class GroupItemComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    toGroupDetails() {
        this.router.navigate(["groups/group-details"]);
    }
}
