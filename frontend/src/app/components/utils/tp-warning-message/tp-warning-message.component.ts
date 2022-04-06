import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tp-warning-message',
  templateUrl: './tp-warning-message.component.html',
  styleUrls: ['./tp-warning-message.component.scss']
})
export class TpWarningMessageComponent implements OnInit {

  @Input() message: string;

  constructor() { }

  ngOnInit(): void {
  }

}
