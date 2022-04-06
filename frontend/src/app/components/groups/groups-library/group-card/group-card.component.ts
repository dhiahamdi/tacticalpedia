import { Component, Input, OnInit } from '@angular/core';
import { Group } from 'app/interfaces/GroupModel';
import { GroupService } from 'app/services/group.service';

@Component({
  selector: 'app-group-card',
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss']
})
export class GroupCardComponent implements OnInit {

  @Input() group: Group;

  public cover_image;

  constructor(
    private groupService: GroupService,
  ) { }

  ngOnInit(): void {
    console.log(this.group)

    this.groupService.getGroupCover(this.group.img).subscribe(
      data => {

        var reader = new FileReader();

        reader.readAsDataURL(data); // read file as data url


        reader.onload = (event) => { // called once readAsDataURL is completed
          this.cover_image = {
            data: (event.target.result), 
            type: data.type
          };
        }

      },

      err => console.log(err)
    )
  }

}

