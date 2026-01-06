import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(workflows: any[] | undefined, searchText: string): any[] {

    if (!workflows) return [];
    if (!searchText) return workflows;
    
    searchText = searchText.toLowerCase();
    return workflows.filter(item => {
      return item.name.toLowerCase().includes(searchText);
    });
    
  }

}
