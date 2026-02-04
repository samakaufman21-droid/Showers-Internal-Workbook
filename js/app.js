// Patriot Showers Measurement Workbook - Application Logic

let currentSection = 1;
const totalSections = 6;
let photoData = {};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date
    const today = new Date();
    document.getElementById('measureDate').value = today.toLocaleDateString('en-US');
    
    // Initialize progress
    updateProgress();
    
    // Setup checkbox state handlers
    setupCheckboxHandlers();
});

// Setup checkbox visual state handlers
function setupCheckboxHandlers() {
    document.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const checkboxItem = e.target.closest('.checkbox-item');
            if (checkboxItem) {
                if (e.target.checked) {
                    checkboxItem.classList.add('checked');
                } else {
                    checkboxItem.classList.remove('checked');
                }
            }
        }
        
        // Show window dimensions if window checkbox is checked
        if (e.target.id === 'windowInWet') {
            const windowGroup = document.getElementById('windowDimensionsGroup');
            if (e.target.checked) {
                windowGroup.classList.remove('section-hidden');
            } else {
                windowGroup.classList.add('section-hidden');
            }
        }
    });
    
    // Handle radio button selections
    document.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            const radioGroup = e.target.closest('.radio-group');
            if (radioGroup) {
                radioGroup.querySelectorAll('.radio-item').forEach(item => {
                    item.classList.remove('selected');
                });
                e.target.closest('.radio-item').classList.add('selected');
            }
        }
    });
}

// Handle photo uploads
function handlePhotoUpload(input, previewId) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const previewDiv = document.getElementById(previewId);
            const parentBox = previewDiv.closest('.photo-upload-box');
            
            previewDiv.innerHTML = `
                <img src="${e.target.result}" alt="Preview">
                <button class="remove-photo" onclick="removePhoto('${input.id}', '${previewId}', event)">×</button>
            `;
            parentBox.classList.add('has-image');
            
            // Store photo data
            photoData[input.id] = {
                name: file.name,
                data: e.target.result
            };
        };
        reader.readAsDataURL(file);
    }
}

function removePhoto(inputId, previewId, event) {
    event.stopPropagation();
    const input = document.getElementById(inputId);
    const previewDiv = document.getElementById(previewId);
    const parentBox = previewDiv.closest('.photo-upload-box');
    
    input.value = '';
    delete photoData[inputId];
    
    // Restore original content based on label
    const labels = {
        'previewBathroomEntry': { icon: '📷', label: 'Bathroom Entry', instruction: 'Full view from doorway' },
        'previewFloorLine': { icon: '📷', label: 'Base & Floor Line', instruction: 'Show base and floor transition' },
        'previewBottomRight': { icon: '📷', label: 'Bottom Right Corner', instruction: 'Floor to mid-wall, right side' },
        'previewTopRight': { icon: '📷', label: 'Top Right Corner', instruction: 'Mid-wall to ceiling, right side' },
        'previewBottomLeft': { icon: '📷', label: 'Bottom Left Corner', instruction: 'Floor to mid-wall, left side' },
        'previewTopLeft': { icon: '📷', label: 'Top Left Corner', instruction: 'Mid-wall to ceiling, left side' },
        'previewBMeasurement': { icon: '📷', label: 'B Measurement', instruction: 'Show tape measure depth' },
        'previewCurbToToilet': { icon: '📷', label: 'Curb to Toilet Distance', instruction: 'Measure curb to toilet center' },
        'previewWaterShutoff': { icon: '📷', label: 'Water Shut-off Valve', instruction: 'Location and accessibility' },
        'previewElectricalPanel': { icon: '📷', label: 'Electrical Panel', instruction: 'Main panel location' },
        'previewWindow': { icon: '📷', label: 'Window (if present)', instruction: 'Show position in wet area' },
        'previewPostTension': { icon: '📷', label: 'Post Tension Stamp', instruction: 'If visible in garage/basement' },
        'previewMisc1': { icon: '📷', label: 'Additional Photo 1', instruction: 'Any damage or special conditions' },
        'previewMisc2': { icon: '📷', label: 'Additional Photo 2', instruction: 'Optional' },
        'previewMisc3': { icon: '📷', label: 'Additional Photo 3', instruction: 'Optional' },
        'previewMisc4': { icon: '📷', label: 'Additional Photo 4', instruction: 'Optional' }
    };
    
    const content = labels[previewId];
    if (content) {
        previewDiv.innerHTML = `
            <div class="upload-icon">${content.icon}</div>
            <div class="photo-label">${content.label}</div>
            <div class="photo-instruction">${content.instruction}</div>
        `;
    }
    
    parentBox.classList.remove('has-image');
}

// Update shower type visualization
function updateShowerType() {
    const showerType = document.querySelector('input[name="showerType"]:checked');
    if (showerType) {
        document.querySelectorAll('#showerTypeGroup .radio-item').forEach(item => {
            item.classList.remove('selected');
        });
        showerType.closest('.radio-item').classList.add('selected');
    }
}

// Navigation functions
function nextSection(current) {
    if (validateSection(current)) {
        currentSection = current + 1;
        updateDisplay();
    }
}

function previousSection(current) {
    currentSection = current - 1;
    updateDisplay();
}

function validateSection(sectionNum) {
    let isValid = true;
    let errorMessage = '';

    switch(sectionNum) {
        case 1:
            const repName = document.getElementById('repName').value;
            const customerName = document.getElementById('customerName').value;
            const jobAddress = document.getElementById('jobAddress').value;
            
            if (!repName || !customerName || !jobAddress) {
                errorMessage = 'Please fill in all required fields (marked with *)';
                isValid = false;
            }
            break;
        
        case 2:
            const showerType = document.querySelector('input[name="showerType"]:checked');
            if (!showerType) {
                errorMessage = 'Please select an existing shower type';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        alert(errorMessage);
    }
    
    return isValid;
}

function updateDisplay() {
    // Hide all sections
    for (let i = 1; i <= totalSections; i++) {
        document.getElementById(`section${i}`).classList.add('section-hidden');
    }
    
    // Show current section
    document.getElementById(`section${currentSection}`).classList.remove('section-hidden');
    
    // Update progress
    updateProgress();
    
    // Generate summary if on last section
    if (currentSection === totalSections) {
        generateSummary();
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgress() {
    // Update step indicators
    document.querySelectorAll('.step').forEach(step => {
        const stepNum = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        
        if (stepNum === currentSection) {
            step.classList.add('active');
        } else if (stepNum < currentSection) {
            step.classList.add('completed');
        }
    });
    
    // Update progress bar
    const progressPercent = ((currentSection - 1) / (totalSections - 1)) * 100;
    document.getElementById('progressLine').style.width = `${progressPercent}%`;
}

function generateSummary() {
    const summaryContent = document.getElementById('summaryContent');
    
    let html = '<div class="summary-section">';
    html += '<h3 class="subsection-title">Job Information</h3>';
    html += `<div class="summary-item"><span class="summary-label">Sales Rep:</span><span class="summary-value">${document.getElementById('repName').value}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Date:</span><span class="summary-value">${document.getElementById('measureDate').value}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Customer:</span><span class="summary-value">${document.getElementById('customerName').value}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Address:</span><span class="summary-value">${document.getElementById('jobAddress').value}</span></div>`;
    html += '</div>';
    
    html += '<div class="summary-section">';
    html += '<h3 class="subsection-title">Shower Configuration</h3>';
    const showerType = document.querySelector('input[name="showerType"]:checked');
    html += `<div class="summary-item"><span class="summary-label">Shower Type:</span><span class="summary-value">${showerType ? showerType.value : 'Not selected'}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Floor Level:</span><span class="summary-value">${document.getElementById('floorLevel').value || 'Not specified'}</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">Base Type:</span><span class="summary-value">${document.getElementById('baseType').value || 'Not specified'}</span></div>`;
    html += '</div>';
    
    html += '<div class="summary-section">';
    html += '<h3 class="subsection-title">Photos Uploaded</h3>';
    const photoCount = Object.keys(photoData).length;
    html += `<div class="summary-item"><span class="summary-label">Total Photos:</span><span class="summary-value">${photoCount} photos</span></div>`;
    html += '</div>';
    
    html += '<div class="summary-section">';
    html += '<h3 class="subsection-title">Key Measurements</h3>';
    html += `<div class="summary-item"><span class="summary-label">A (Width):</span><span class="summary-value">${document.getElementById('measNewA').value || 'Not measured'}"</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">B (Depth):</span><span class="summary-value">${document.getElementById('measNewB').value || 'Not measured'}"</span></div>`;
    html += `<div class="summary-item"><span class="summary-label">D (Height):</span><span class="summary-value">${document.getElementById('measNewD').value || 'Not measured'}"</span></div>`;
    html += '</div>';
    
    // Count checked issues
    const issueChecks = document.querySelectorAll('#section5 input[type="checkbox"]:checked');
    if (issueChecks.length > 0) {
        html += '<div class="summary-section">';
        html += '<h3 class="subsection-title">Site Issues Identified</h3>';
        issueChecks.forEach(check => {
            const label = check.closest('.checkbox-item').textContent.trim();
            html += `<div class="summary-item"><span class="summary-value">⚠️ ${label}</span></div>`;
        });
        html += '</div>';
    }
    
    summaryContent.innerHTML = html;
}

function exportData() {
    const data = {
        jobInfo: {
            repName: document.getElementById('repName').value,
            date: document.getElementById('measureDate').value,
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            customerEmail: document.getElementById('customerEmail').value,
            jobAddress: document.getElementById('jobAddress').value
        },
        configuration: {
            showerType: document.querySelector('input[name="showerType"]:checked')?.value,
            newConfig: document.querySelector('input[name="newConfig"]:checked')?.value,
            floorLevel: document.getElementById('floorLevel').value,
            baseType: document.getElementById('baseType').value,
            drainLocation: document.getElementById('drainLocation').value,
            drainAccess: document.getElementById('drainAccess').checked,
            movingDrain: document.getElementById('movingDrain').checked,
            concreteSub: document.getElementById('concreteSub').checked,
            postTension: document.getElementById('postTension').checked,
            fourthWall: document.getElementById('fourthWall').checked,
            manufacturedHome: document.getElementById('manufacturedHome').checked,
            condo: document.getElementById('condo').checked,
            windowInWet: document.getElementById('windowInWet').checked,
            windowDimensions: {
                height: document.getElementById('windowHeight').value,
                width: document.getElementById('windowWidth').value,
                toCeiling: document.getElementById('windowToCeiling').value
            }
        },
        measurements: {
            A: { 
                existing: document.getElementById('measExistingA').value, 
                new: document.getElementById('measNewA').value, 
                notes: document.getElementById('notesA').value 
            },
            B: { 
                existing: document.getElementById('measExistingB').value, 
                new: document.getElementById('measNewB').value, 
                notes: document.getElementById('notesB').value 
            },
            C: { 
                existing: document.getElementById('measExistingC').value, 
                new: document.getElementById('measNewC').value, 
                notes: document.getElementById('notesC').value 
            },
            C2: { 
                existing: document.getElementById('measExistingC2').value, 
                new: document.getElementById('measNewC2').value, 
                notes: document.getElementById('notesC2').value 
            },
            D: { 
                existing: document.getElementById('measExistingD').value, 
                new: document.getElementById('measNewD').value, 
                notes: document.getElementById('notesD').value 
            },
            E: { 
                existing: document.getElementById('measExistingE').value, 
                new: document.getElementById('measNewE').value, 
                notes: document.getElementById('notesE').value 
            },
            E2: { 
                existing: document.getElementById('measExistingE2').value, 
                new: document.getElementById('measNewE2').value, 
                notes: document.getElementById('notesE2').value 
            },
            F: { 
                existing: document.getElementById('measExistingF').value, 
                new: document.getElementById('measNewF').value, 
                notes: document.getElementById('notesF').value 
            },
            G: { 
                existing: document.getElementById('measExistingG').value, 
                new: document.getElementById('measNewG').value, 
                notes: document.getElementById('notesG').value 
            },
            baseToToilet: document.getElementById('measBaseToToilet').value,
            newSurroundHeight: document.getElementById('measNewSurroundHeight').value
        },
        siteConditions: {
            issues: {
                mold: document.getElementById('issueMold').checked,
                noGrabBars: document.getElementById('issueNoGrabBars').checked,
                noAntiSlip: document.getElementById('issueNoAntiSlip').checked,
                failingCaulk: document.getElementById('issueFailingCaulk').checked,
                crackedGrout: document.getElementById('issueCrackedGrout').checked,
                staining: document.getElementById('issueStaining').checked,
                waterDamage: document.getElementById('issueWaterDamage').checked,
                failedDrain: document.getElementById('issueFailedDrain').checked,
                tempPressure: document.getElementById('issueTempPressure').checked,
                leaking: document.getElementById('issueLeaking').checked
            },
            structuralNotes: document.getElementById('structuralNotes').value,
            accessNotes: document.getElementById('accessNotes').value,
            preferredInstallDate: document.getElementById('preferredInstallDate').value,
            bestContactTime: document.getElementById('bestContactTime').value,
            customerRequests: document.getElementById('customerRequests').value,
            additionalNotes: document.getElementById('additionalNotes').value
        },
        photos: photoData
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const customerName = document.getElementById('customerName').value.replace(/\s+/g, '-') || 'customer';
    link.download = `patriot-showers-workbook-${customerName}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    alert('✓ Workbook data downloaded! You can also print this page using the Print button.');
}
