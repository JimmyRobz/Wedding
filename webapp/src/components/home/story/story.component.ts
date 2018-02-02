import { Component } from '@angular/core';

@Component({
    selector: 'story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.scss']
})
export class StoryComponent {

    static title = 'Notre histoire';
    static fragment = 'story';

    stories = [
        {
            year: '2004',
            month: 'Sept',
            title: 'Notre rencontre',
            content: "On s'est rencontré en 2nde, à la rentrée 2004, au lycée de Bras-Panon dans la classe de M. Muller. On est rapidement passé de camarades de classe à amis, mais à ce moment là aucunde nous deux ne pensaient vraiment à ce qui allait se passer."
        },
        {
            year: '2004',
            month: 'Sept',
            title: 'Notre rencontre',
            content: "On s'est rencontré en 2nde, à la rentrée 2004, au lycée de Bras-Panon dans la classe de M. Muller. On est rapidement passé de camarades de classe à amis, mais à ce moment là aucunde nous deux ne pensaient vraiment à ce qui allait se passer."
        },
        {
            year: '2004',
            month: 'Sept',
            title: 'Notre rencontre',
            content: "On s'est rencontré en 2nde, à la rentrée 2004, au lycée de Bras-Panon dans la classe de M. Muller. On est rapidement passé de camarades de classe à amis, mais à ce moment là aucunde nous deux ne pensaient vraiment à ce qui allait se passer."
        },
        {
            year: '2004',
            month: 'Sept',
            title: 'Notre rencontre',
            content: "On s'est rencontré en 2nde, à la rentrée 2004, au lycée de Bras-Panon dans la classe de M. Muller. On est rapidement passé de camarades de classe à amis, mais à ce moment là aucunde nous deux ne pensaient vraiment à ce qui allait se passer."
        },
        {
            year: '2004',
            month: 'Sept',
            title: 'Notre rencontre',
            content: "On s'est rencontré en 2nde, à la rentrée 2004, au lycée de Bras-Panon dans la classe de M. Muller. On est rapidement passé de camarades de classe à amis, mais à ce moment là aucunde nous deux ne pensaient vraiment à ce qui allait se passer."
        }
    ]
}
