import React, { useState } from 'react';
import '../../styles/ExerciseTipTricep.css';
import TricepImage from '../../assets/tricep_detail.png';
import { exerciseImageMap } from '../../utils/exerciseImageMap';
import { armExerciseDetails } from '../../constants/exerciseScript';
import ExerciseModal from '../../components/ExerciseModal';
import PageTitle from '../../components/PageTitle';

const ExerciseTipTricep = () => {
    const [selectedPart, setSelectedPart] = useState('');
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (exercise) => {
        setSelectedExercise(exercise);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="tricep-wrapper">
            <div style = {{padding:'10px', backgroundColor : '#f7f7f7'}}></div>
            <PageTitle title="삼두 부위" showBackArrow={true} />
            <div style={{ margin: `30px` }}></div>
            <div className="tricep-page">
                <div className="left-section">
                    <div className="tricep-image-wrapper">
                        <img src={TricepImage} alt="tricep Detail" className="tricep-image" />
                        <div className="area ltricep" onClick={() => setSelectedPart('장두')} />
                        <div className="area otricep" onClick={() => setSelectedPart('외측두')} />
                        <div className="area itricep" onClick={() => setSelectedPart('내측두')} />
                    </div>
                </div>

                <div className="right-section">
                    <h2 className="section-title">
                        {selectedPart ? `삼두 (${selectedPart}) 운동` : '삼두 부위를 선택해보세요!'}
                    </h2>
                    {selectedPart && (
                        <div className="exercise-list">
                            {armExerciseDetails['삼두'][selectedPart].map((exercise, idx) => (
                                <div key={idx} className="exercise-card" onClick={() => openModal(exercise)}>
                                    <img
                                        src={exercise.image ? exerciseImageMap[exercise.image] : '/assets/default.jpg'}
                                        alt={exercise.name}
                                        className='exercise-image'
                                    />
                                    <p className="exercise-title">{exercise.name}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && selectedExercise && (
                <ExerciseModal exercise={selectedExercise} onClose={closeModal} />
            )}
        </div>
    );
};

export default ExerciseTipTricep;
