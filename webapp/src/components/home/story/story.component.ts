import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
            title: 'Première rencontre',
            content: "On s'est rencontrés en 2nde au lycée de Bras-Panon. On est rapidement passés de camarades de classe à amis, mais à ce moment là aucun de nous deux ne pensait vraiment à ce qui allait se passer.",
            picture: '/assets/images/events/rencontre.jpg'
        },
        {
            year: '2006',
            month: 'Sept',
            title: 'Début de l\'amourette',
            content: "On commence notre petite histoire, alors que nos profs nous disent que ce n'est qu'une amourette. Alors M. Babef ? On dit quoi maintenant ?",
            picture: '/assets/images/events/jeunes.jpg'
        },
        {
            year: '2007',
            month: 'Août',
            title: 'On vit ensemble',
            content: "Début des études et de notre vie commune, dans notre grand appart à Angers.",
            picture: '/assets/images/events/angers.jpg'
        },
        {
            year: '2012',
            month: 'Oct',
            title: 'On devient Toulousains',
            content: "Après les études on décide de s'installer à Toulouse, la ville rose devient notre nouveau chez nous.",
            picture: '/assets/images/events/toulouse.jpg'
        },
        {
            year: '2014',
            month: 'Juin',
            title: 'Just PACSed',
            content: "On se PACS le 06 juin 2014 à Toulouse.",
            picture: '/assets/images/events/pacs.jpg'
        },
        {
            year: '2016',
            month: 'Juil',
            title: 'Naissance du petit nous',
            content: "Notre petit couple devient une petite famille avec la naissance de notre petit ange Oan.",
            picture: '/assets/images/events/oan.jpg'
        },
        {
            year: '2016',
            month: 'Sept',
            title: 'Demande en mariage',
            content: "Pour nos 10 ans, petit week-end en amoureux à Biarritz. Au bord de la plage, Jimmy se lance et demande Ophélie en mariage. Bizarrement elle a dit oui ! 😄",
            picture: '/assets/images/events/biarritz.jpg'
        }
    ];

    constructor(private sanitizer: DomSanitizer) {
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustStyle(`url(${url})`);
    }
}
