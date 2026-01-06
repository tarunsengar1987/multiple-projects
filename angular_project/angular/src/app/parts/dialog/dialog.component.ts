import { Component, ComponentRef, Inject, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DynamicComponent {
  [key: string]: any;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
  @ViewChild('dynamicContent', { read: ViewContainerRef, static: true }) dynamicContent!: ViewContainerRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DialogComponent>) {}

  ngOnInit(): void {
    if (this.data && this.data.component) {
      const componentRef : ComponentRef<DynamicComponent> = this.dynamicContent.createComponent(this.data.component);

      if (this.data.componentData) {
        Object.assign(componentRef.instance, this.data.componentData);
      }
    }
  }

  onCloseClick(): void {
    // Optionally pass data back to the parent component
    // this.dialogRef.close(this.dialogRef.componentInstance.data.componentData.data);
    this.dialogRef.close();
  }
}
