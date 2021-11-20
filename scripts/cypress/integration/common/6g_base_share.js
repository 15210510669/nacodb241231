
import { mainPage } from "../../support/page_objects/mainPage"
import { projectsPage } from "../../support/page_objects/navigation"
import { isTestSuiteActive } from "../../support/page_objects/projectConstants"
import { _advSettings, _editSchema, _editData, _editComment, _viewMenu, _topRightMenu } from "../spec/roleValidation.spec"

let linkText = ''

export const genTest = (type, xcdb) => {
    if(!isTestSuiteActive(type, xcdb)) return;

    describe(`${type.toUpperCase()} Columns of type attachment`, () => {
        // before(() => {
        //     cy.waitForSpinners();
        //     cy.signinOrSignup(roles.owner.credentials)
        //     cy.wait(2000)
        // })

        // after(() => {
        //     cy.closeTableTab('Country')          
        // })
        
        it(`Generate base share URL`, () => {
            // click SHARE
            cy.get('.nc-topright-menu')
                .find('.nc-menu-share')
                .click()
            
            // Click on readonly base text
            cy.getActiveModal()
                .find('.nc-container')
                .contains('Generate publicly shareable readonly base')
                .click()
            
            // Select 'Readonly link'
            cy.getActiveMenu()
                .find('.caption')
                .contains('Readonly link')
                .click()
            
            // Copy URL
            cy.getActiveModal()
                .find('.nc-url')
                .then(($obj) => {
                    cy.log($obj[0])
                    linkText = $obj[0].innerText.trim()

                    const htmlFile = `
<!DOCTYPE html>
<html>
<body>

<iframe
class="nc-embed"
src="${linkText}?embed"
frameborder="0"
width="100%"
height="700"
style="background: transparent; "></iframe>

</body>
</html>
            `
                    cy.writeFile("scripts/cypress/fixtures/sampleFiles/iFrame.html", htmlFile)
            })
        })

        it(`Visit base shared URL`, () => {
            cy.log(linkText)

            // visit URL & wait for page load to complete
            cy.visit(linkText, {
                baseUrl: null
            })
            projectsPage.waitHomePageLoad()
        })

        it(`Validate access permissions`, () => {
            let roleType = 'viewer'

            _advSettings(roleType, false)
            _editSchema(roleType, false)
            _editData(roleType, false)
            _editComment(roleType, false)
            _viewMenu(roleType, false)
        })

        it('Generate & verify embed HTML IFrame', { baseUrl: null }, () => {
            // open iFrame html
            cy.visit('scripts/cypress/fixtures/sampleFiles/iFrame.html')

            // wait for iFrame to load
            cy.frameLoaded('.nc-embed')

            // validation for base menu opitons
            cy.iframe().find('.nc-project-tree').should('exist')
            cy.iframe().find('.nc-fields-menu-btn').should('exist')
            cy.iframe().find('.nc-sort-menu-btn').should('exist')
            cy.iframe().find('.nc-filter-menu-btn').should('exist')
            cy.iframe().find('.nc-actions-menu-btn').should('exist')

            // validate data (row-1)
            mainPage.getIFrameCell('FirstName', 1).contains("PENELOPE").should('exist')
            mainPage.getIFrameCell('LastName', 1).contains("GUINESS").should('exist')
        })
     })
}

/**
 * @copyright Copyright (c) 2021, Xgene Cloud Ltd
 *
 * @author Raju Udava <sivadstala@gmail.com>
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */
